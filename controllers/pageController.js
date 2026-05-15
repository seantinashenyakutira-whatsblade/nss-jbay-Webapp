const { supabase } = require('../config/supabase');

const pageController = {
  async home(req, res) {
    try {
      const { data: units, error } = await supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .order('sqm', { ascending: true })
        .limit(4);

      res.render('pages/index', { title: 'Home', featuredUnits: units || [] });
    } catch (err) {
      console.error('Home page error:', err);
      res.render('pages/index', { title: 'Home', featuredUnits: [] });
    }
  },

  async units(req, res) {
    try {
      let query = supabase
        .from('units')
        .select('*')
        .eq('is_active', true)
        .order('sqm', { ascending: true });

      const { size, availability } = req.query;

      if (size && size !== 'all') {
        query = query.eq('size', size);
      }
      if (availability && availability !== 'all') {
        query = query.eq('availability', availability);
      }

      const { data: units, error } = await query;

      if (error) {
        console.error('Units page error:', error);
        req.flash('error', 'Failed to load units');
        return res.render('pages/units', { title: 'Storage Units', units: [], size, availability });
      }

      res.render('pages/units', { title: 'Storage Units', units: units || [], size, availability });
    } catch (err) {
      console.error('Units page error:', err);
      req.flash('error', 'Failed to load units');
      const { size, availability } = req.query;
      res.render('pages/units', { title: 'Storage Units', units: [], size, availability });
    }
  },

  about(req, res) {
    res.render('pages/about', { title: 'About Us' });
  },

  contact(req, res) {
    res.render('pages/contact', { title: 'Contact' });
  },

  async submitContact(req, res) {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !message) {
        req.flash('error', 'Please fill in all required fields');
        return res.render('pages/contact', { title: 'Contact' });
      }

      const { error } = await supabase.from('contact_messages').insert({
        name,
        email,
        phone: phone || null,
        message,
      });

      if (error) {
        console.error('Contact message error:', error);
        req.flash('error', 'Failed to send message. Please try again.');
        return res.render('pages/contact', { title: 'Contact' });
      }

      req.flash('success', 'Thank you! We will get back to you soon.');
      res.redirect('/contact');
    } catch (err) {
      console.error('submitContact error:', err);
      req.flash('error', 'Failed to send message');
      res.render('pages/contact', { title: 'Contact' });
    }
  },

  faq(req, res) {
    res.render('pages/faq', { title: 'FAQ' });
  },
};

module.exports = pageController;
