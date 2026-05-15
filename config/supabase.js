const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Throw on missing config — silent noop chains mask deployment errors
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(
    'SUPABASE_URL is missing or invalid. Set it in .env (e.g. https://xxxx.supabase.co)'
  );
}
if (!supabaseAnonKey) {
  throw new Error(
    'SUPABASE_ANON_KEY is missing. Set it in .env'
  );
}
if (!supabaseServiceKey) {
  throw new Error(
    'SUPABASE_SERVICE_KEY is missing. Set it in .env (required for admin operations like profile creation)'
  );
}

// Server-side client — we manage sessions via express-session, not localStorage.
// autoRefreshToken: true ensures the access token stays valid for the duration of
// the server-side operation (e.g. profile lookup after login).
const clientOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
  },
};

const supabase = createClient(supabaseUrl, supabaseAnonKey, clientOptions);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, clientOptions);

module.exports = { supabase, supabaseAdmin };
