const { supabase, supabaseAdmin } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

const DURATION_DISCOUNTS = { 1: 0, 3: 5, 6: 10, 12: 15 };
const VALID_DURATIONS = [1, 3, 6, 12];

function generateReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'NSS-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function calculateEndDate(startDate, months) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().split('T')[0];
}

const bookingController = {
  async showBookingForm(req, res) {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .order('sqm', { ascending: true });

      if (error) {
        console.error('Unit fetch error:', error);
        req.flash('error', 'Failed to load booking form');
        return res.redirect('/units');
      }

      const preselected = req.query.unit || '';
      res.render('pages/bookings/new', { title: 'New Booking', units: units || [], preselected });
    } catch (err) {
      console.error('showBookingForm error:', err);
      req.flash('error', 'Failed to load booking form');
      res.redirect('/units');
    }
  },

  async createBooking(req, res) {
    try {
      const { unitId, duration, startDate } = req.body;
      const userId = req.session.user.id;

      if (!unitId || !duration || !startDate) {
        req.flash('error', 'Please fill in all required fields');
        return res.redirect('/bookings/new');
      }

      const durationMonths = parseInt(duration);
      if (!VALID_DURATIONS.includes(durationMonths)) {
        req.flash('error', 'Invalid rental duration');
        return res.redirect('/bookings/new');
      }

      const { data: unit, error: unitError } = await supabase
        .from('units')
        .select('*')
        .eq('id', unitId)
        .single();

      if (unitError || !unit) {
        req.flash('error', 'Unit not found');
        return res.redirect('/bookings/new');
      }

      if (unit.availability === 'unavailable') {
        req.flash('error', 'This unit is currently unavailable');
        return res.redirect('/bookings/new');
      }

      const monthlyRate = parseFloat(unit.price_monthly);
      const discountPercent = DURATION_DISCOUNTS[durationMonths] || 0;
      const subtotal = monthlyRate * durationMonths;
      const discountAmount = Math.round(subtotal * discountPercent / 100);
      const totalAmount = subtotal - discountAmount;
      const endDate = calculateEndDate(startDate, durationMonths);
      const reference = generateReference();

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          unit_id: unitId,
          reference,
          start_date: startDate,
          duration_months: durationMonths,
          end_date: endDate,
          monthly_rate: monthlyRate,
          total_amount: totalAmount,
          discount_applied: discountAmount,
          status: 'active',
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Booking create error:', bookingError);
        req.flash('error', 'Failed to create booking. Please try again.');
        return res.redirect('/bookings/new');
      }

      if (unit.availability === 'few-left') {
        await supabase
          .from('units')
          .update({ availability: 'unavailable', updated_at: new Date().toISOString() })
          .eq('id', unitId);
      }

       req.flash('success', `Booking created! Please complete payment to activate your rental.`);
       res.redirect(`/payments/pay/${booking.id}`);
    } catch (err) {
      console.error('createBooking error:', err);
      req.flash('error', 'Failed to create booking');
      res.redirect('/bookings/new');
    }
  },

  async getUserBookings(req, res) {
    try {
      const userId = req.session.user.id;

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*, units(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('User bookings fetch error:', error);
        req.flash('error', 'Failed to load bookings');
        return res.render('pages/account/bookings', { title: 'My Bookings', bookings: [] });
      }

      res.render('pages/account/bookings', { title: 'My Bookings', bookings: bookings || [] });
    } catch (err) {
      console.error('getUserBookings error:', err);
      req.flash('error', 'Failed to load bookings');
      res.render('pages/account/bookings', { title: 'My Bookings', bookings: [] });
    }
  },

  async getBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;

      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*, units(*)')
        .eq('id', id)
        .single();

      if (error || !booking) {
        req.flash('error', 'Booking not found');
        return res.redirect('/account/bookings');
      }

      if (booking.user_id !== userId && !req.session.user.is_admin) {
        req.flash('error', 'You do not have permission to view this booking');
        return res.redirect('/account/bookings');
      }

      const { data: payments } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', id)
        .order('created_at', { ascending: false });

      res.render('pages/bookings/show', {
        title: 'Booking Details',
        booking,
        payments: payments || [],
      });
    } catch (err) {
      console.error('getBooking error:', err);
      req.flash('error', 'Failed to load booking');
      res.redirect('/account/bookings');
    }
  },

  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;

      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !booking) {
        req.flash('error', 'Booking not found');
        return res.redirect('/account/bookings');
      }

      if (booking.user_id !== userId && !req.session.user.is_admin) {
        req.flash('error', 'You do not have permission to cancel this booking');
        return res.redirect('/account/bookings');
      }

      if (booking.status !== 'active') {
        req.flash('error', 'Only active bookings can be cancelled');
        return res.redirect(`/bookings/${id}`);
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Booking cancel error:', error);
        req.flash('error', 'Failed to cancel booking');
        return res.redirect(`/bookings/${id}`);
      }

      req.flash('success', 'Booking cancelled successfully');
      res.redirect('/account/bookings');
    } catch (err) {
      console.error('cancelBooking error:', err);
      req.flash('error', 'Failed to cancel booking');
      res.redirect('/account/bookings');
    }
  },

  async adminListBookings(req, res) {
    try {
      const { status, search } = req.query;
      let query = supabase
        .from('bookings')
        .select('*, units(name), profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: bookings, error } = await query;

      if (error) {
        console.error('Admin bookings fetch error:', error);
        req.flash('error', 'Failed to load bookings');
        return res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: [] });
      }

      res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: bookings || [] });
    } catch (err) {
      console.error('adminListBookings error:', err);
      req.flash('error', 'Failed to load bookings');
      res.render('pages/admin/bookings', { title: 'Manage Bookings', bookings: [] });
    }
  },

  async adminUpdateBooking(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['active', 'completed', 'cancelled', 'expired'];
      if (!validStatuses.includes(status)) {
        req.flash('error', 'Invalid booking status');
        return res.redirect('/admin/bookings');
      }

      const { error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Admin booking update error:', error);
        req.flash('error', 'Failed to update booking');
        return res.redirect('/admin/bookings');
      }

      req.flash('success', 'Booking updated successfully');
      res.redirect('/admin/bookings');
    } catch (err) {
      console.error('adminUpdateBooking error:', err);
      req.flash('error', 'Failed to update booking');
      res.redirect('/admin/bookings');
    }
  },

  async accountOverview(req, res) {
    try {
      const userId = req.session.user.id;

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, units(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'completed');

      const activeRentals = (bookings || []).filter(b => b.status === 'active').length;
      const totalSpent = (payments || []).reduce((sum, p) => sum + parseFloat(p.amount), 0);

      const nextPaymentBooking = (bookings || []).find(b => b.status === 'active');
      const nextPayment = nextPaymentBooking ? parseFloat(nextPaymentBooking.total_amount) : 0;

      const recentActivity = (bookings || []).slice(0, 5).map(b => ({
        date: b.created_at,
        description: `${b.status === 'cancelled' ? 'Cancelled' : 'Booked'} ${b.units ? b.units.name : 'Unit'} (${b.reference})`,
        status: b.status,
      }));

      res.render('pages/account/dashboard', {
        title: 'Account Overview',
        user: req.session.user || {},
        activeRentals,
        totalSpent,
        nextPayment,
        recentActivity,
      });
    } catch (err) {
      console.error('accountOverview error:', err);
      res.render('pages/account/dashboard', {
        title: 'Account Overview',
        user: req.session.user || {},
        activeRentals: 0,
        totalSpent: 0,
        nextPayment: 0,
        recentActivity: [],
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const { firstName, lastName, phone } = req.body;
      const userId = req.session.user.id;

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Profile update error:', error);
        req.flash('error', 'Failed to update profile');
        return res.redirect('/account/profile');
      }

      if (req.session.user) {
        req.session.user.first_name = firstName;
        req.session.user.last_name = lastName;
        req.session.user.phone = phone || null;
      }

      req.flash('success', 'Profile updated successfully');
      res.redirect('/account/profile');
    } catch (err) {
      console.error('updateProfile error:', err);
      req.flash('error', 'Failed to update profile');
      res.redirect('/account/profile');
    }
  },

  async deleteAccount(req, res) {
    try {
      const userId = req.session.user.id;
      const userEmail = req.session.user.email;
      const confirmedEmail = req.body.email || '';

      // Server-side validation of email confirmation
      if (confirmedEmail.trim().toLowerCase() !== userEmail.toLowerCase()) {
        req.flash('error', 'Email confirmation does not match. Account not deleted.');
        return res.redirect('/account/profile');
      }

      // Cancel all active bookings first
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (bookingError) {
        console.error('Booking cancellation error:', bookingError);
      }

      // Delete all payments associated with the user
      const { error: paymentsDeleteError } = await supabase
        .from('payments')
        .delete()
        .eq('user_id', userId);

      if (paymentsDeleteError) {
        console.error('Payments deletion error:', paymentsDeleteError);
      }

      // Delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
        req.flash('error', 'Failed to delete account. Please contact support.');
        return res.redirect('/account/profile');
      }

      // Delete auth user (this must be last)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Auth deletion error:', authError);
        req.flash('error', 'Failed to delete account. Please contact support.');
        return res.redirect('/account/profile');
      }

      // Destroy session and redirect
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.redirect('/');
      });
    } catch (err) {
      console.error('deleteAccount error:', err);
      req.flash('error', 'An error occurred while deleting your account. Please contact support.');
      res.redirect('/account/profile');
    }
  },
};

module.exports = bookingController;
