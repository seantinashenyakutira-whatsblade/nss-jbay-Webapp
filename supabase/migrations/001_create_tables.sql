-- Migration 001: Create core tables for National Secure Storage
-- Created: 2026-05-16
-- Updated: 2026-05-16 - Added settings table, delete_user_account RPC, clean re-runs

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects for clean re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS update_units_updated_at ON units;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS units CASCADE;

-- Units table
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('extra-small', 'small', 'medium', 'large')),
  sqm INTEGER NOT NULL,
  dimensions TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_annual INTEGER,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'few-left', 'rented')),
  description TEXT,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  block_section TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
  reference TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE,
  duration_months INTEGER NOT NULL DEFAULT 1,
  monthly_rate INTEGER NOT NULL,
  discount_applied INTEGER DEFAULT 0,
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'pending_payment', 'confirmed', 'active', 'cancelled', 'completed', 'expired')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'card',
  card_brand TEXT,
  card_last_four TEXT,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (single row, id=1)
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name TEXT DEFAULT 'National Secure Storage',
  location TEXT DEFAULT 'Jeffrey''s Bay',
  address TEXT DEFAULT '35 St Croix Street, Jeffrey''s Bay, Eastern Cape, 6330',
  phone_primary TEXT DEFAULT '063 546 1740',
  phone_secondary TEXT DEFAULT '061 905 8382',
  email TEXT DEFAULT 'info@nss-jbay.co.za',
  facebook_url TEXT DEFAULT 'https://facebook.com/nssjbay',
  operating_hours JSONB DEFAULT '{"monday":"08:00-18:00","tuesday":"08:00-18:00","wednesday":"08:00-18:00","thursday":"08:00-18:00","friday":"08:00-18:00","saturday":"08:00-14:00","sunday":"Closed","public_holidays":"Closed"}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_units_size ON units(size);
CREATE INDEX IF NOT EXISTS idx_units_availability ON units(availability);
CREATE INDEX IF NOT EXISTS idx_units_is_active ON units(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_unit_id ON bookings(unit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- Enable RLS
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Units policies
CREATE POLICY "Units publicly viewable" ON units FOR SELECT USING (true);
CREATE POLICY "Admins manage units" ON units FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Profiles policies
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
CREATE POLICY "Admins update any profile" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Bookings policies
CREATE POLICY "Users view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
CREATE POLICY "Users create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);
CREATE POLICY "System insert payments" ON payments FOR INSERT WITH CHECK (true);

-- Contact messages policies
CREATE POLICY "Anyone submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view contact messages" ON contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- Settings policies
CREATE POLICY "Anyone view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins update settings" ON settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make user admin function
CREATE OR REPLACE FUNCTION make_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Delete user account function (called from profile page)
CREATE OR REPLACE FUNCTION delete_user_account(user_email TEXT)
RETURNS void AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  IF user_id IS NOT NULL THEN
    DELETE FROM auth.users WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default settings
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
