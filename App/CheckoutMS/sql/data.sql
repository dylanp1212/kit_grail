DELETE FROM order_item;
DELETE FROM orders;

INSERT INTO orders(id, shopper, stripe_session_id, status, data)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  'cs_test_sally_order_1',
  'paid',
  jsonb_build_object('paid_at', '2026-05-01T10:00:00+00:00'::timestamptz)
);

INSERT INTO order_item(order_id, kit_listing, data)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74',
  jsonb_build_object('title', '2014 Argentina Messi Jersey', 'price', 300)
);

INSERT INTO order_item(order_id, kit_listing, data)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000001',
  '4d40647d-6691-4b8f-bec4-b93831e28e17',
  jsonb_build_object('title', '2006 Italy Home Jersey', 'price', 134)
);

INSERT INTO orders(id, shopper, stripe_session_id, status, data)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000002',
  '3436e28c-8d0f-42e1-a733-eb42358ca451',
  'cs_test_tommy_order_1',
  'paid',
  jsonb_build_object('paid_at', '2026-05-02T14:30:00+00:00'::timestamptz)
);

INSERT INTO order_item(order_id, kit_listing, data)
VALUES (
  'a1b2c3d4-0000-0000-0000-000000000002',
  'b685a347-fe92-4e43-a551-0bbbaeafad6b',
  jsonb_build_object('title', '2012 Barcelona Home Jersey Iniesta', 'price', 123)
);
