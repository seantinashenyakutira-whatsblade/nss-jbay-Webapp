const { supabase, supabaseAdmin } = require('../config/supabase');

/**
 * Map Supabase error codes to user-friendly messages.
 * NEVER expose internal server details (stack traces, etc.).
 */
function friendlyAuthError(error) {
  if (!error) return null;

  const msg = error.message || '';

  // Rate limiting
  if (
    msg.toLowerCase().includes('rate limit') ||
    msg.toLowerCase().includes('too many requests') ||
    error.status === 429
  ) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  // Email not confirmed
  if (
    msg.toLowerCase().includes('email not confirmed') ||
    msg.toLowerCase().includes('email_not_confirmed')
  ) {
    return 'Please confirm your email address before logging in. Check your inbox (and spam folder).';
  }

  // User not found
  if (msg.toLowerCase().includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  // User already exists (signup)
  if (msg.toLowerCase().includes('user already registered')) {
    return 'An account with this email already exists. Try logging in instead.';
  }

  // Weak password
  if (msg.toLowerCase().includes('password') && msg.toLowerCase().includes('weak')) {
    return 'Password is too weak. Use at least 8 characters with a mix of letters, numbers, and symbols.';
  }

  // Invalid email format
  if (msg.toLowerCase().includes('invalid') && msg.toLowerCase().includes('email')) {
    return 'Please enter a valid email address.';
  }

  // Catch-all: log the real error server-side but show generic message
  console.error('Supabase auth error:', error);
  return 'An unexpected error occurred. Please try again.';
}

function generateSession(req, user, profile) {
  req.session.user = {
    id: user.id,
    email: user.email,
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    is_admin: profile?.is_admin || false,
    created_at: profile?.created_at || user.created_at || new Date().toISOString(),
  };
}

function renderLogin(res, title, errorMsg) {
  res.render('auth/login', {
    title: title || 'Login',
    error_msg: errorMsg ? [errorMsg] : [],
    messages: errorMsg ? [{ type: 'error', text: errorMsg }] : [],
  });
}

function renderRegister(res, title, errorMsg) {
  res.render('auth/login', {
    title: title || 'Create Account',
    registerActive: true,
    error_msg: errorMsg ? [errorMsg] : [],
    messages: errorMsg ? [{ type: 'error', text: errorMsg }] : [],
  });
}

const authController = {
  showLogin(req, res) {
    res.render('auth/login', { title: 'Login' });
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return renderLogin(res, 'Login', 'Please provide both email and password.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        return renderLogin(res, 'Login', friendlyAuthError(error));
      }

      if (!data?.user) {
        return renderLogin(res, 'Login', 'Login failed. Please try again.');
      }

      // Check if email is confirmed (Supabase can require confirmation)
      if (!data.user.email_confirmed_at && process.env.REQUIRE_EMAIL_CONFIRM !== 'false') {
        // Try to check if email confirmation is required
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email.trim().toLowerCase(),
        });
        if (resendError) {
          console.error('Resend confirmation error:', resendError);
        }
        return renderLogin(
          res,
          'Login',
          'Please confirm your email address. A new confirmation link has been sent to your inbox.'
        );
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      generateSession(req, data.user, profile);

      req.flash('success', 'Welcome back!');
      const redirect = req.query.redirect || (profile?.is_admin ? '/admin/dashboard' : '/account/profile');
      res.redirect(redirect);
    } catch (err) {
      console.error('Login error:', err);
      return renderLogin(res, 'Login', 'An error occurred during login. Please try again.');
    }
  },

  async register(req, res) {
    try {
      const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return renderRegister(res, 'Create Account', 'Please fill in all required fields.');
      }

      if (password.length < 8) {
        return renderRegister(res, 'Create Account', 'Password must be at least 8 characters.');
      }

      if (password !== confirmPassword) {
        return renderRegister(res, 'Create Account', 'Passwords do not match.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (error) {
        return renderRegister(res, 'Create Account', friendlyAuthError(error));
      }

      if (!data?.user) {
        return renderRegister(res, 'Create Account', 'Registration failed. Please try again.');
      }

      // Create profile using the service role client (bypasses RLS)
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: data.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone?.trim() || null,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't block the user — profile can be created on first login if needed.
        // Log the error for manual review.
      }

      // If email confirmation is required, tell the user
      if (process.env.REQUIRE_EMAIL_CONFIRM !== 'false' && !data.user.email_confirmed_at) {
        req.flash(
          'success',
          'Account created! Please check your email for a confirmation link before logging in.'
        );
        return res.redirect('/auth/login');
      }

      // Auto-login if no email confirmation required
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      generateSession(req, data.user, profile);

      req.flash('success', 'Account created successfully! Welcome to National Secure Storage.');
      res.redirect(req.query.redirect || '/account/profile');
    } catch (err) {
      console.error('Register error:', err);
      return renderRegister(res, 'Create Account', 'An error occurred during registration. Please try again.');
    }
  },

  async logout(req, res) {
    try {
      // Sign out from Supabase (invalidates the refresh token server-side)
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }
    } catch (err) {
      console.error('Supabase signOut error:', err);
    }

    // Destroy the Express session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/');
    });
  },
};

module.exports = authController;
