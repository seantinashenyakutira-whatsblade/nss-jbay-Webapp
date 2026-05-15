require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { supabaseAdmin } = require('../config/supabase');

async function seedAdmin(email) {
  if (!email) {
    console.error('Usage: node db/seed-admin.js admin@email.com');
    process.exit(1);
  }

  console.log(`NSS JBay — Create Admin User\n`);
  console.log(`Promoting user: ${email}\n`);

  const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

  if (userError || !user) {
    const { data: signUp, error: signUpError } = await supabaseAdmin.auth.signUp({
      email,
      password: 'admin123',
    });

    if (signUpError) {
      console.error('Error creating user:', signUpError.message);
      process.exit(1);
    }

    console.log(`✓ User created with email: ${email}`);
    console.log(`  Default password: admin123`);

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: signUp.user.id,
        first_name: 'Admin',
        last_name: 'User',
        is_admin: true,
      });

    if (profileError) {
      console.error('Error creating profile:', profileError.message);
    } else {
      console.log('✓ Admin profile created');
    }

    process.exit(0);
  }

  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: user.id,
      first_name: 'Admin',
      last_name: 'User',
      is_admin: true,
    }, { onConflict: 'id' });

  if (profileError) {
    console.error('Error updating profile:', profileError.message);
    process.exit(1);
  }

  console.log('✓ User promoted to admin successfully');
  process.exit(0);
}

const email = process.argv[2];
seedAdmin(email);
