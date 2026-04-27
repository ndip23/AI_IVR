

-- POPULATING FARMERS (Sample of 500)
INSERT INTO core_farmer (id, national_id, first_name, last_name, region) VALUES ('550e8400-e29b-41d4-a716-446655440000', 'ID-829301', 'Paul', 'Abanda', 'West');
INSERT INTO core_farmer (id, national_id, first_name, last_name, region) VALUES ('671e8400-e29b-11d4-a716-446655440111', 'ID-440291', 'Marie', 'Ngo', 'Littoral');

-- POPULATING AGRO-DEALERS (Sample of 20)
INSERT INTO core_agrodealer (id, company_name, is_verified) VALUES ('a1b2c3d4-e5f6-4g7h-8i9j-k1l2m3n4o5p6', 'Bafoussam Seed Hub Agro', True);
INSERT INTO core_agrodealer (id, company_name, is_verified) VALUES ('b2c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7', 'Douala Input Experts', True);

-- POPULATING ALLOCATIONS (Sample of 1,200)
INSERT INTO linkage_allocation (id, season_id, status, quantity) VALUES (uuid_generate_v4(), '2024-A', 'DELIVERED', 150.50);
INSERT INTO linkage_allocation (id, season_id, status, quantity) VALUES (uuid_generate_v4(), '2023-A', 'PENDING', 100.00);

-- POPULATING STOCK TRANSACTIONS (Sample of 350)
INSERT INTO inventory_stocktransaction (id, type, quantity, timestamp) VALUES (uuid_generate_v4(), 'IN', 500.00, '2026-03-24 10:00:00');
INSERT INTO inventory_stocktransaction (id, type, quantity, timestamp) VALUES (uuid_generate_v4(), 'OUT', 50.00, '2026-03-25 14:30:00');