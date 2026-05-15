const { supabase } = require('../config/supabase');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

const DURATION_DISCOUNTS = { 1: 0, 3: 5, 6: 10, 12: 15 };

const unitController = {
  async listUnits(req, res) {
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
        console.error('Unit fetch error:', error);
        req.flash('error', 'Failed to load units');
        return res.render('pages/units', { title: 'Storage Units', units: [], size, availability });
      }

      res.render('pages/units', { title: 'Storage Units', units: units || [], size, availability });
    } catch (err) {
      console.error('listUnits error:', err);
      req.flash('error', 'Failed to load units');
      const { size, availability } = req.query;
      res.render('pages/units', { title: 'Storage Units', units: [], size, availability });
    }
  },

  async getUnit(req, res) {
    try {
      const { id } = req.params;
      const { data: unit, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !unit) {
        req.flash('error', 'Unit not found');
        return res.redirect('/units');
      }

      res.render('pages/unit-detail', { title: unit.name, unit });
    } catch (err) {
      console.error('getUnit error:', err);
      req.flash('error', 'Failed to load unit');
      res.redirect('/units');
    }
  },

  async getUnitJson(req, res) {
    try {
      const { id } = req.params;
      const { data: unit, error } = await supabase
        .from('units')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !unit) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      const discounts = DURATION_DISCOUNTS;
      const pricing = Object.entries(discounts).map(([months, discount]) => {
        const monthlyRate = parseFloat(unit.price_monthly);
        const subtotal = monthlyRate * parseInt(months);
        const discountAmount = Math.round(subtotal * discount / 100);
        return {
          months: parseInt(months),
          discount,
          monthlyRate,
          subtotal,
          discountAmount,
          total: subtotal - discountAmount,
        };
      });

      res.json({ unit, pricing });
    } catch (err) {
      console.error('getUnitJson error:', err);
      res.status(500).json({ error: 'Failed to load unit data' });
    }
  },

  async createUnit(req, res) {
    try {
      const {
        name, size, sqm, dimensions, price_monthly, price_annual,
        description, availability, block_section, features,
      } = req.body;

      if (!name || !size || !sqm || !dimensions || !price_monthly) {
        req.flash('error', 'Please fill in all required fields');
        return res.redirect('/admin/units');
      }

      let imageUrls = [];

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const filename = `units/${uuidv4()}${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('unit-images')
          .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('unit-images')
            .getPublicUrl(filename);

          if (urlData) imageUrls.push(urlData.publicUrl);
        }
      }

      const featuresArr = features
        ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim()))
        : [];

      const { error } = await supabase.from('units').insert({
        name,
        size,
        sqm: parseInt(sqm),
        dimensions,
        price_monthly: parseFloat(price_monthly),
        price_annual: price_annual ? parseFloat(price_annual) : null,
        description: description || '',
        availability: availability || 'available',
        block_section: block_section || null,
        features: featuresArr,
        image_urls: imageUrls,
        is_active: true,
      });

      if (error) {
        console.error('Unit create error:', error);
        req.flash('error', 'Failed to create unit');
        return res.redirect('/admin/units');
      }

      req.flash('success', 'Unit created successfully');
      res.redirect('/admin/units');
    } catch (err) {
      console.error('createUnit error:', err);
      req.flash('error', 'Failed to create unit');
      res.redirect('/admin/units');
    }
  },

  async updateUnit(req, res) {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      const allowedFields = [
        'name', 'size', 'sqm', 'dimensions', 'price_monthly', 'price_annual',
        'description', 'availability', 'block_section', 'features', 'is_active',
      ];

      Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) delete updates[key];
      });

      if (updates.sqm) updates.sqm = parseInt(updates.sqm);
      if (updates.price_monthly) updates.price_monthly = parseFloat(updates.price_monthly);
      if (updates.price_annual) updates.price_annual = parseFloat(updates.price_annual);
      if (updates.is_active !== undefined) updates.is_active = updates.is_active === 'true' || updates.is_active === true;
      if (updates.features && typeof updates.features === 'string') {
        updates.features = updates.features.split(',').map(f => f.trim());
      }

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const filename = `units/${uuidv4()}${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('unit-images')
          .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('unit-images')
            .getPublicUrl(filename);

          if (urlData) {
            updates.image_urls = supabase.rpc('array_append', {
              arr: updates.image_urls || [],
              element: urlData.publicUrl,
            });
          }
        }
      }

      updates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('units')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Unit update error:', error);
        req.flash('error', 'Failed to update unit');
        return res.redirect('/admin/units');
      }

      req.flash('success', 'Unit updated successfully');
      res.redirect('/admin/units');
    } catch (err) {
      console.error('updateUnit error:', err);
      req.flash('error', 'Failed to update unit');
      res.redirect('/admin/units');
    }
  },

  async deleteUnit(req, res) {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('units')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Unit delete error:', error);
        return res.status(500).json({ error: 'Failed to deactivate unit' });
      }

      res.json({ success: true, message: 'Unit deactivated' });
    } catch (err) {
      console.error('deleteUnit error:', err);
      res.status(500).json({ error: 'Failed to deactivate unit' });
    }
  },
};

module.exports = { unitController, upload };
