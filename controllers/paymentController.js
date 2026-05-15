const { supabase } = require('../config/supabase');
const { v4: uuidv4 } = require('uuid');

function generatePaymentReference() {
  return 'PAY-' + uuidv4().toUpperCase().slice(0, 8);
}

const paymentController = {
  async showPaymentPage(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.session.user.id;

      const { data: booking, error } = await supabase
        .from('bookings')
        .select('*, units(*)')
        .eq('id', bookingId)
        .single();

      if (error || !booking) {
        req.flash('error', 'Booking not found');
        return res.redirect('/account/bookings');
      }

      if (booking.user_id !== userId && !req.session.user.is_admin) {
        req.flash('error', 'You do not have permission to view this booking');
        return res.redirect('/account/bookings');
      }

      res.render('pages/payments/pay', { title: 'Make Payment', booking });
    } catch (err) {
      console.error('showPaymentPage error:', err);
      req.flash('error', 'Failed to load payment page');
      res.redirect('/account/bookings');
    }
  },

   async processPayment(req, res) {
    try {
      const { bookingId, amount, cardLastFour, cardBrand, cardholderName, paymentMethod } = req.body;
      const userId = req.session.user.id;

      if (!bookingId || !amount) {
        return res.status(400).json({ error: 'Booking ID and amount are required' });
      }

      // Validate card details (basic validation)
      if (!cardLastFour || !cardBrand || !cardholderName) {
        return res.status(400).json({ error: 'Card details are required' });
      }

      // Validate cardLastFour is exactly 4 digits
      if (!/^\d{4}$/.test(cardLastFour)) {
        return res.status(400).json({ error: 'Invalid card last four digits' });
      }

      // Validate cardBrand is one of the allowed (for demo, we'll allow visa and mastercard)
      const allowedBrands = ['visa', 'mastercard'];
      if (!allowedBrands.includes(cardBrand.toLowerCase())) {
        return res.status(400).json({ error: 'Unsupported card brand' });
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.user_id !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      const reference = generatePaymentReference();
      const paymentAmount = parseFloat(amount);

      // Simulate payment processing delay and random outcome for demo
      // In a real implementation, this would call a payment gateway
      await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 second delay

      // 85% success rate for demo
      const isSuccessful = Math.random() < 0.85;

      if (!isSuccessful) {
        // Generate a random decline reason for realism
        const declineReasons = [
          { code: 'insufficient_funds', message: 'Your card was declined due to insufficient funds.' },
          { code: 'card_expired', message: 'Your card has expired. Please use a different card.' },
          { code: 'stolen_card', message: 'This transaction appears fraudulent. Your card has been blocked.' },
          { code: 'issuer_unavailable', message: 'The card issuer is not available. Please try again later.' },
          { code: 'generic_decline', message: 'Card declined. Please check your card details and try again.' }
        ];
        const randomReason = declineReasons[Math.floor(Math.random() * declineReasons.length)];

        // Record the failed payment
        const { data: failedPayment, error: failedPaymentError } = await supabase
          .from('payments')
          .insert({
            booking_id: bookingId,
            user_id: userId,
            amount: paymentAmount,
            payment_method: paymentMethod || 'card',
            card_last_four: cardLastFour,
            card_brand: cardBrand,
            status: 'failed',
            reference: `FAIL-${uuidv4().toUpperCase().slice(0, 8)}`,
          })
          .select()
          .single();

        if (failedPaymentError) {
          console.error('Failed payment create error:', failedPaymentError);
          return res.status(500).json({ error: 'Payment processing failed' });
        }

        return res.json({
          success: false,
          payment: {
            reference: failedPayment.reference,
            amount: paymentAmount,
            status: 'failed',
            card_last_four: cardLastFour,
            card_brand: cardBrand,
          },
          message: randomReason.message,
          decline_code: randomReason.code
        });
      }

      // Successful payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          user_id: userId,
          amount: paymentAmount,
          payment_method: paymentMethod || 'card',
          card_last_four: cardLastFour,
          card_brand: cardBrand,
          status: 'completed',
          reference,
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment create error:', paymentError);
        return res.status(500).json({ error: 'Payment processing failed' });
      }

      res.json({
        success: true,
        payment: {
          reference,
          amount: paymentAmount,
          status: 'completed',
          card_last_four: cardLastFour,
          card_brand: cardBrand,
        },
        message: `Payment of R${paymentAmount} processed successfully`,
      });
    } catch (err) {
      console.error('processPayment error:', err);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  },

  async getPaymentHistory(req, res) {
    try {
      const userId = req.session.user.id;

      const { data: payments, error } = await supabase
        .from('payments')
        .select('*, bookings(reference, units(name))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('user_id', userId)
        .eq('status', 'completed');

      const totalSpent = (allPayments || []).reduce((sum, p) => sum + parseFloat(p.amount), 0);

      if (error) {
        console.error('Payment history fetch error:', error);
        req.flash('error', 'Failed to load payment history');
        return res.render('pages/account/payments', { title: 'Payment History', payments: [], totalSpent: 0 });
      }

      res.render('pages/account/payments', { title: 'Payment History', payments: payments || [], totalSpent });
    } catch (err) {
      console.error('getPaymentHistory error:', err);
      req.flash('error', 'Failed to load payment history');
      res.render('pages/account/payments', { title: 'Payment History', payments: [], totalSpent: 0 });
    }
  },

  async getPaymentInvoice(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;

      const { data: payment, error } = await supabase
        .from('payments')
        .select('*, bookings(reference, total_amount, units(name))')
        .eq('id', id)
        .single();

      if (error || !payment) {
        return res.status(404).json({ success: false, error: 'Payment not found' });
      }

      if (payment.user_id !== userId && !req.session.user.is_admin) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      res.json({ success: true, payment });
    } catch (err) {
      console.error('getPaymentInvoice error:', err);
      res.status(500).json({ success: false, error: 'Failed to load invoice data' });
    }
  },

  async adminListPayments(req, res) {
    try {
      const { status, search } = req.query;
      let query = supabase
        .from('payments')
        .select('*, bookings(reference), profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data: payments, error } = await query;

      if (error) {
        console.error('Admin payments fetch error:', error);
        return res.status(500).json({ error: 'Failed to load payments' });
      }

      res.json({ payments: payments || [] });
    } catch (err) {
      console.error('adminListPayments error:', err);
      res.status(500).json({ error: 'Failed to load payments' });
    }
  },
};

module.exports = paymentController;
