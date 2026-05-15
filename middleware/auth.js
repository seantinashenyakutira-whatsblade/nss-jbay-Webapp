const { supabase } = require('../config/supabase');

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error', 'Please log in to access this page.');
  return res.redirect('/auth/login');
}

/**
 * Checks the is_admin flag stored in the session during login.
 * Avoids a database query on every admin page request.
 * The session is_admin is set by generateSession() in authController.
 */
function isAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    req.flash('error', 'Please log in to access this page.');
    return res.redirect('/auth/login');
  }

  if (!req.session.user.is_admin) {
    return res.status(403).render('pages/403', { title: 'Access Denied' });
  }

  next();
}

/**
 * Refreshes the session user data from the profiles table.
 * Called on every request to ensure session is current.
 */
async function setUser(req, res, next) {
  if (req.session && req.session.user) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.session.user.id)
        .maybeSingle();

      if (!error && profile) {
        // Merge profile data into currentUser for templates
        res.locals.currentUser = {
          ...req.session.user,
          ...profile,
        };
      } else {
        res.locals.currentUser = req.session.user;
      }

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = "row not found" — allowed during profile creation race
        console.error('setUser profile query error:', error);
      }
    } catch (err) {
      console.error('setUser error:', err);
      res.locals.currentUser = req.session.user;
    }
  } else {
    res.locals.currentUser = null;
  }
  next();
}

module.exports = { isAuthenticated, isAdmin, setUser };
