-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Storage units table
CREATE TABLE units (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('extra-small', 'small', 'medium', 'large')),
  sqm INTEGER NOT NULL,
  dimensions TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2),
  description TEXT,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available', 'few-left', 'unavailable')),
  block_section TEXT,
  features TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  unit_id UUID REFERENCES units(id) NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  start_date DATE NOT NULL,
  duration_months INTEGER NOT NULL CHECK (duration_months IN (1, 3, 6, 12)),
  end_date DATE NOT NULL,
  monthly_rate DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_applied DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT DEFAULT 'card',
    card_last_four VARCHAR(4),
    card_brand VARCHAR(20),
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    reference TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (single row)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name TEXT DEFAULT 'National Secure Storage',
  location TEXT DEFAULT 'Jeffrey''s Bay',
  address TEXT DEFAULT '35 St Croix Street, Jeffrey''s Bay, Eastern Cape, 6330',
  phone_primary TEXT DEFAULT '063 546 1740',
  phone_secondary TEXT DEFAULT '061 905 8382',
  email TEXT DEFAULT 'info@nss-jbay.co.za',
  facebook_url TEXT,
  operating_hours JSONB DEFAULT '{"monday":"08:00-17:00","tuesday":"08:00-17:00","wednesday":"08:00-17:00","thursday":"08:00-17:00","friday":"08:00-17:00","saturday":"09:00-13:00","sunday":"closed"}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Units policies
CREATE POLICY "Anyone can view active units" ON units FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can insert units" ON units FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update units" ON units FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can delete units" ON units FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can update any booking" ON bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
CREATE POLICY "Admins can insert payments" ON payments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Settings policies
CREATE POLICY "Anyone can view settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Insert default settings
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for unit images
-- Note: Run this in Supabase dashboard SQL editor
-- INSERT INTO storage.buckets (id, name, public) VALUES ('unit-images', 'unit-images', true);
-- Storage policy: Public read, Admin write

-- Seed data: 8 sample units
INSERT INTO units (name, size, sqm, dimensions, price_monthly, price_annual, description, availability, block_section, features) VALUES
('Extra Small — Essentials', 'extra-small', 6, '3m × 2m × 2.4m', 450, 4500, 'Perfect for boxes, seasonal items, and small furniture. Ground floor access.', 'available', 'A', ARRAY['ground-floor', 'cctv']),
('Extra Small — Compact', 'extra-small', 6, '3m × 2m × 2.4m', 450, 4500, 'Ideal for students and small storage needs.', 'few-left', 'A', ARRAY['cctv']),
('Small — Starter', 'small', 9, '3m × 3m × 2.4m', 750, 7500, 'Fits the contents of a studio apartment.', 'available', 'B', ARRAY['ground-floor', 'cctv']),
('Small — Business', 'small', 9, '3m × 3m × 2.4m', 750, 7500, 'Great for business inventory and stock.', 'few-left', 'B', ARRAY['cctv']),
('Medium — Family', 'medium', 18, '6m × 3m × 2.4m', 1200, 12000, 'Fits contents of a 2-bedroom home. Drive-up access.', 'available', 'C', ARRAY['ground-floor', 'cctv', 'drive-up']),
('Medium — Commercial', 'medium', 18, '6m × 3m × 2.4m', 1200, 12000, 'Ideal for contractors and small businesses.', 'available', 'C', ARRAY['drive-up', 'cctv']),
('Large — Mega', 'large', 27, '9m × 3m × 2.4m', 1800, 18000, 'Fits the contents of a large home or vehicle. Double doors.', 'few-left', 'D', ARRAY['ground-floor', 'cctv', 'drive-up', 'double-door']),
('Large — Enterprise', 'large', 27, '9m × 3m × 2.4m', 1800, 18000, 'Maximum storage for commercial needs.', 'available', 'D', ARRAY['cctv', 'drive-up', 'double-door']);

-- Create admin user function (run after signup)
CREATE OR REPLACE FUNCTION make_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET is_admin = true 
  WHERE id = (SELECT id FROM auth.users WHERE email = user_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
