const { supabase } = require('../config/supabase');

const adminController = {
  async dashboard(req, res) {
    try {
      const [unitsResult, bookingsResult, usersResult, paymentsResult] = await Promise.all([
        supabase.from('units').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount'),
      ]);

      const totalUnits = unitsResult.count || 0;
      const activeBookings = bookingsResult.count || 0;
      const totalUsers = usersResult.count || 0;

      const totalRevenue = (paymentsResult.data || []).reduce(
        (sum, p) => sum + parseFloat(p.amount || 0), 0
      );

      res.render('pages/admin/dashboard', {
        title: 'Admin Dashboard',
        stats: { totalUnits, activeBookings, totalUsers, totalRevenue },
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      res.render('pages/admin/dashboard', {
        title: 'Admin Dashboard',
        stats: { totalUnits: 0, activeBookings: 0, totalUsers: 0, totalRevenue: 0 },
      });
    }
  },

   async manageUnits(req, res) {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('*')
        .order('sqm', { ascending: true });

      if (error) {
        console.error('Admin units fetch error:', error);
        req.flash('error', 'Failed to load units');
        return res.render('pages/admin/units', { title: 'Manage Units', units: [] });
      }

      res.render('pages/admin/units', { title: 'Manage Units', units: units || [] });
    } catch (err) {
      console.error('manageUnits error:', err);
      req.flash('error', 'Failed to load units');
      res.render('pages/admin/units', { title: 'Manage Units', units: [] });
    }
  },

  async showNewUnitForm(req, res) {
    res.render('pages/admin/add-unit', { title: 'Add New Unit' });
  },

  async editUnitForm(req, res) {
    try {
      const { id } = req.params;
      const { data: unit, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !unit) {
        req.flash('error', 'Unit not found');
        return res.redirect('/admin/units');
      }
      res.render('pages/admin/add-unit', { title: 'Edit Unit', unit });
    } catch (err) {
      console.error('editUnitForm error:', err);
      req.flash('error', 'Failed to load unit');
      res.redirect('/admin/units');
    }
  },

  async manageBookings(req, res) {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*, units(name), profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Admin bookings fetch error:', error);
        req.flash('error', 'Failed to load bookings');
        return res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: [] });
      }

      res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: bookings || [] });
    } catch (err) {
      console.error('manageBookings error:', err);
      req.flash('error', 'Failed to load bookings');
      res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: [] });
    }
  },

  async managePricing(req, res) {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('*')
        .order('sqm', { ascending: true });

      if (error) {
        console.error('Admin pricing fetch error:', error);
        req.flash('error', 'Failed to load pricing data');
        return res.render('pages/admin/pricing', { title: 'Manage Pricing', units: [] });
      }

      res.render('pages/admin/pricing', { title: 'Manage Pricing', units: units || [] });
    } catch (err) {
      console.error('managePricing error:', err);
      req.flash('error', 'Failed to load pricing data');
      res.render('pages/admin/pricing', { title: 'Manage Pricing', units: [] });
    }
  },

   async managePayments(req, res) {
    try {
      const [paymentsResult, allCompletedPayments] = await Promise.all([
        supabase
          .from('payments')
          .select('*, bookings(reference), profiles(first_name, last_name, email)')
          .order('created_at', { ascending: false }),
        supabase.from('payments').select('amount').eq('status', 'completed'),
      ]);

      const payments = paymentsResult.data || [];
      const totalRevenue = (allCompletedPayments.data || []).reduce(
        (sum, p) => sum + parseFloat(p.amount || 0), 0
      );

      if (paymentsResult.error) {
        console.error('Admin payments fetch error:', paymentsResult.error);
        req.flash('error', 'Failed to load payments');
        return res.render('pages/admin/payments', { title: 'Payments', payments: [], totalRevenue: 0 });
      }

      res.render('pages/admin/payments', { title: 'Payments', payments, totalRevenue });
    } catch (err) {
      console.error('managePayments error:', err);
      req.flash('error', 'Failed to load payments');
      res.render('pages/admin/payments', { title: 'Payments', payments: [], totalRevenue: 0 });
    }
  },

  async manageCustomers(req, res) {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Admin customers fetch error:', error);
        req.flash('error', 'Failed to load customers');
        return res.render('pages/admin/users', { title: 'Manage Customers', customers: [] });
      }

      res.render('pages/admin/users', { title: 'Manage Customers', customers: profiles || [] });
    } catch (err) {
      console.error('manageCustomers error:', err);
      req.flash('error', 'Failed to load customers');
      res.render('pages/admin/users', { title: 'Manage Customers', customers: [] });
    }
  },

  async manageSettings(req, res) {
    try {
      const { data: settings, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();

      res.render('pages/admin/settings', {
        title: 'Settings',
        settings: settings || null,
      });
    } catch (err) {
      console.error('manageSettings error:', err);
      res.render('pages/admin/settings', { title: 'Settings', settings: null });
    }
  },

   async updateSettings(req, res) {
    try {
      const allowedFields = [
        'business_name', 'location', 'address', 'phone_primary',
        'phone_secondary', 'email', 'facebook_url', 'operating_hours',
      ];
      const updates = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      updates.updated_at = new Date().toISOString();

      if (req.body.operating_hours && typeof req.body.operating_hours === 'string') {
        try {
          updates.operating_hours = JSON.parse(req.body.operating_hours);
        } catch {
          updates.operating_hours = req.body.operating_hours;
        }
      }

      const { error } = await supabase
        .from('settings')
        .upsert({ id: 1, ...updates });

      if (error) {
        console.error('Settings update error:', error);
        req.flash('error', 'Failed to update settings');
        return res.redirect('/admin/settings');
      }

      req.flash('success', 'Settings updated successfully');
      res.redirect('/admin/settings');
    } catch (err) {
      console.error('updateSettings error:', err);
      req.flash('error', 'Failed to update settings');
      return res.redirect('/admin/settings');
    }
  },

  async updateBulkPricing(req, res) {
    try {
      const { size, price_monthly, price_annual } = req.body;
      if (!size) {
        return res.status(400).json({ error: 'Size is required' });
      }
      const validSizes = ['extra-small', 'small', 'medium', 'large'];
      if (!validSizes.includes(size)) {
        return res.status(400).json({ error: 'Invalid size' });
      }
      // Validate prices if provided
      let updates = {};
      if (price_monthly !== undefined) {
        const monthly = parseFloat(price_monthly);
        if (isNaN(monthly) || monthly < 0) {
          return res.status(400).json({ error: 'Invalid monthly price' });
        }
        updates.price_monthly = monthly;
      }
      if (price_annual !== undefined) {
        const annual = parseFloat(price_annual);
        if (isNaN(annual) || annual < 0) {
          return res.status(400).json({ error: 'Invalid annual price' });
        }
        updates.price_annual = annual;
      }
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No valid price updates provided' });
      }
      updates.updated_at = new Date().toISOString();
      const { data: units, error } = await supabase
        .from('units')
        .update(updates)
        .eq('size', size);
      if (error) {
        console.error('Admin bulk pricing error:', error);
        return res.status(500).json({ error: 'Failed to update pricing' });
      }
      res.json({ success: true, count: units.length, message: `Updated ${units.length} ${size} units` });
    } catch (err) {
      console.error('updateBulkPricing error:', err);
      res.status(500).json({ error: 'Failed to update pricing' });
    }
  },

  async getStats(req, res) {
    try {
      const [
        { count: totalUnits },
        { count: availableUnits },
        { count: activeBookings },
        { count: totalUsers },
        paymentsResult,
      ] = await Promise.all([
        supabase.from('units').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('units').select('*', { count: 'exact', head: true }).eq('availability', 'available').eq('is_active', true),
        supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount'),
      ]);

      const totalRevenue = (paymentsResult.data || []).reduce(
        (sum, p) => sum + parseFloat(p.amount || 0), 0
      );
      const occupancy = totalUnits > 0
        ? Math.round(((totalUnits - availableUnits) / totalUnits) * 100)
        : 0;

      res.json({
        totalUnits: totalUnits || 0,
        availableUnits: availableUnits || 0,
        activeBookings: activeBookings || 0,
        totalUsers: totalUsers || 0,
        totalRevenue,
        occupancy,
      });
    } catch (err) {
      console.error('getStats error:', err);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};

module.exports = adminController;
