const { supabase } = require('../config/supabase');

const passwordController = {
  /**
   * GET /auth/forgot-password
   * Shows the "enter your email" form.
   */
  showForgotPassword(req, res) {
    res.render('auth/forgot-password', { title: 'Reset Password' });
  },

  /**
   * POST /auth/forgot-password
   * Sends a password reset email via Supabase Auth.
   * Always returns success (even if email doesn't exist) to prevent email enumeration.
   */
  async sendResetEmail(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        req.flash('error', 'Please enter your email address.');
        return res.render('auth/forgot-password', { title: 'Reset Password' });
      }

      const redirectUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/reset-password/callback`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: redirectUrl }
      );

      if (error) {
        console.error('Password reset error:', error);
        // Still show success to prevent email enumeration
      }

      req.flash(
        'success',
        'If an account exists with that email, we have sent a password reset link. Please check your inbox (and spam folder).'
      );
      return res.redirect('/auth/login');
    } catch (err) {
      console.error('sendResetEmail error:', err);
      req.flash('error', 'An error occurred. Please try again.');
      return res.render('auth/forgot-password', { title: 'Reset Password' });
    }
  },

  /**
   * GET /auth/reset-password/callback
   * The page Supabase redirects to after the user clicks the email link.
   * The access token is in the URL hash; we need to extract it and show a form.
   */
  handleResetCallback(req, res) {
    // Supabase sends the user to this page with #access_token=xxx in the URL.
    // The EJS template can access the hash via JavaScript.
    res.render('auth/reset-password', { title: 'Set New Password' });
  },

  /**
   * POST /auth/reset-password
   * Updates the password using the session from the reset link.
   */
  async updatePassword(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      const accessToken = req.headers['x-access-token'] || req.body.access_token;

      if (!password || password.length < 8) {
        req.flash('error', 'Password must be at least 8 characters.');
        return res.render('auth/reset-password', { title: 'Set New Password' });
      }

      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.render('auth/reset-password', { title: 'Set New Password' });
      }

      // If we have an access token in the request, set the session auth
      if (accessToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '',
        });
        if (sessionError) {
          console.error('Set session error:', sessionError);
          req.flash('error', 'Invalid or expired reset link. Please request a new one.');
          return res.redirect('/auth/forgot-password');
        }
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Update password error:', error);
        req.flash('error', 'Failed to update password. Your link may have expired. Please request a new one.');
        return res.redirect('/auth/forgot-password');
      }

      // Sign out all other sessions
      await supabase.auth.signOut({ scope: 'others' });

      req.flash('success', 'Password updated successfully! Please log in with your new password.');
      return res.redirect('/auth/login');
    } catch (err) {
      console.error('updatePassword error:', err);
      req.flash('error', 'An error occurred. Please try again.');
      return res.redirect('/auth/forgot-password');
    }
  },
};

module.exports = passwordController;
