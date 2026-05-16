-- Seed data for National Secure Storage - Jeffrey's Bay
-- Created: 2026-05-16

-- Insert storage units with realistic JBay pricing
INSERT INTO units (name, size, sqm, dimensions, price_monthly, price_annual, availability, description, features, image_url, block_section) VALUES
-- Extra Small Units (6 sqm)
('Locker XS-01', 'extra-small', 6, '3m x 2m x 2.4m', 450, 4860, 'available', 
 'Perfect for boxes, documents, and small personal items. Ideal for students and small apartments.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Individual Lock', 'Ground Floor'],
 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop',
 'A'),

('Locker XS-02', 'extra-small', 6, '3m x 2m x 2.4m', 450, 4860, 'available',
 'Compact storage solution for seasonal items, sports equipment, or business archives.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Individual Lock', 'Ground Floor'],
 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
 'A'),

-- Small Units (9 sqm)
('Unit S-01', 'small', 9, '3m x 3m x 2.4m', 750, 8100, 'available',
 'Great for furniture from a single room, business stock, or household overflow.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access'],
 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
 'B'),

('Unit S-02', 'small', 9, '3m x 3m x 2.4m', 750, 8100, 'few-left',
 'Versatile small unit suitable for appliances, boxes, and medium-sized items.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access'],
 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&h=300&fit=crop',
 'B'),

-- Medium Units (18 sqm)
('Unit M-01', 'medium', 18, '6m x 3m x 2.4m', 1200, 12960, 'available',
 'Spacious enough for contents of a 1-2 bedroom home or small business inventory.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access', 'Well-lit'],
 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
 'C'),

('Unit M-02', 'medium', 18, '6m x 3m x 2.4m', 1200, 12960, 'available',
 'Ideal for renovation storage, business stock, or household contents during a move.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access', 'Well-lit'],
 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
 'C'),

-- Large Units (27 sqm)
('Unit L-01', 'large', 27, '9m x 3m x 2.4m', 1800, 19440, 'available',
 'Large warehouse-style unit for full household moves, business inventory, or vehicle storage.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access', 'Well-lit', 'Wide Access'],
 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
 'D'),

('Unit L-02', 'large', 27, '9m x 3m x 2.4m', 1800, 19440, 'few-left',
 'Premium large unit with excellent access for commercial storage or full home contents.',
 ARRAY['24/7 Access', 'CCTV Monitored', 'Roll-up Door', 'Drive-up Access', 'Well-lit', 'Wide Access'],
 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
 'D');

-- Verify insertion
SELECT COUNT(*) as total_units, 
       size, 
       COUNT(*) as count,
       MIN(price_monthly) as min_price,
       MAX(price_monthly) as max_price
FROM units 
GROUP BY size 
ORDER BY sqm;
