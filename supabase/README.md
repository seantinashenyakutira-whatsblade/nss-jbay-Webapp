# Supabase Database Setup

## Quick Setup Guide

### Step 1: Run the Migration SQL

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/swhkjxytjildbufuqgnr
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `supabase/migrations/001_create_tables.sql`
5. Click **Run** (or press Ctrl+Enter)
6. Verify success - you should see "Success. No rows returned"

### Step 2: Run the Seed Data SQL

1. In the same SQL Editor, click **New Query**
2. Copy and paste the entire contents of `supabase/seed.sql`
3. Click **Run**
4. Verify success - you should see a table showing 8 units across 4 sizes

### Step 3: Verify Tables Were Created

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `units` (8 rows)
   - `profiles`
   - `bookings`
   - `payments`

### Step 4: Create Admin User (Optional)

To create an admin user, run this SQL in the SQL Editor:

```sql
-- First, create the user via Supabase Auth UI or use existing user
-- Then update their profile to be admin:
UPDATE profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_UUID_HERE';
```

Or if you want to create a specific admin user:

```sql
-- Note: You'll need to create the user via Supabase Auth first
-- Then find their UUID and run:
UPDATE profiles SET is_admin = true WHERE id = 'user-uuid-here';
```

## Troubleshooting

### Error: "relation 'units' already exists"
The tables already exist. You can skip this step or run:
```sql
DROP TABLE IF EXISTS payments, bookings, profiles, units CASCADE;
```
Then re-run the migration.

### Error: "policy already exists"
Policies are already set up. You can skip the RLS section or run:
```sql
DROP POLICY IF EXISTS "Units are publicly viewable" ON units;
-- (repeat for other policies)
```

### Tables show 0 rows after seeding
Check that the seed SQL ran successfully. Look for any error messages in the SQL Editor output.

## Environment Variables

Make sure these are set in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=https://swhkjxytjildbufuqgnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_KEY=<your-service-role-key>
NEXT_PUBLIC_MAIN_DOMAIN=nss-jbay.vercel.app
```

## Next Steps

After database setup:
1. Test the `/units` page - it should now show 8 storage units
2. Test user registration - profiles should auto-create
3. Test booking flow
4. Deploy changes to Vercel
