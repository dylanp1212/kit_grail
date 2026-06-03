DELETE FROM shopper;
INSERT INTO shopper(id, data)
VALUES (
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  jsonb_build_object(
    'email','sally@gmail.com',
    'name','Sally Shopper',
    'pwhash',crypt('sallyshopper',gen_salt('bf'))
  )
);
INSERT INTO shopper(id, data)
VALUES (
  '3436e28c-8d0f-42e1-a733-eb42358ca451',
  jsonb_build_object(
    'email','tommy@gmail.com',
    'name','Tommy Shopper',
    'pwhash',crypt('tommyshopper',gen_salt('bf'))
  )
);
INSERT INTO shopper(id, data)
VALUES (
  'c8e3464f-50aa-480c-99ea-6b6171782b37',
  jsonb_build_object(
    'email','timmy@gmail.com',
    'name','Timmy Shopper',
    'pwhash',crypt('timmyshopper',gen_salt('bf'))
  )
);
INSERT INTO shopper(id, data)
VALUES (
  '9cae8254-c592-4a07-bf2e-05f569f12f3c',
  jsonb_build_object(
    'email','terry@gmail.com',
    'name','Terry Shopper',
    'pwhash',crypt('terryshopper',gen_salt('bf'))
  )
);


DELETE FROM seller;
INSERT INTO seller(id, data)
VALUES (
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'email','stewie@gmail.com',
    'name','Stewie Seller',
    'pwhash',crypt('stewieseller',gen_salt('bf'))
  )
);
INSERT INTO seller(id, data)
VALUES (
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'email','bill@gmail.com',
    'name','Bill Seller',
    'pwhash',crypt('billseller',gen_salt('bf'))
  )
);
INSERT INTO seller(id, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'email','will@gmail.com',
    'name','Will Seller',
    'pwhash',crypt('willseller',gen_salt('bf'))
  )
);


DELETE FROM kit_listing;
INSERT INTO kit_listing(id, seller, data)
VALUES (
  '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74',
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'title','2014 Argentina Messi Jersey',
    'description',E'Messi Jersey\n2014 Argentina home jersey\nSize large\nBlue and white',
    'size','large',
    'colors',jsonb_build_array('blue','white'),
    'listed', '2026-03-15T06:34:00+00:00'::timestamptz,
    'price', 300,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);
INSERT INTO kit_listing(id, seller, data)
VALUES (
  '8942027f-523a-4983-843b-0f12370aa1ea',
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'title','Random Jersey',
    'description',E'Some random jersey I found.\nI didnt even wash it',
    'size','small',
    'colors',jsonb_build_array('red','black'),
    'listed', '2026-03-16T16:04:00+00:00'::timestamptz,
    'price', 20,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);
INSERT INTO kit_listing(id, seller, data)
VALUES (
  '4d40647d-6691-4b8f-bec4-b93831e28e17',
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','2006 Italy Home Jersey',
    'description',E'Italy 2006 World Cup home jersey\nWorn during their championship-winning campaign\nSize medium\nNavy blue with gold Adidas stripes',
    'size','medium',
    'colors',jsonb_build_array('navy','white','gold'),
    'listed', '2026-01-10T09:00:00+00:00'::timestamptz,
    'price', 134,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  'd43ab28f-1fbf-4b03-87b1-7a1ede5ce45d',
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','1998 Brazil Away Jersey',
    'description',E'Brazil 1998 World Cup away jersey\nRare blue colorway from the Paris final\nSize large\nNike tick on chest',
    'size','large',
    'colors',jsonb_build_array('blue','white'),
    'listed', '2026-01-22T14:15:00+00:00'::timestamptz,
    'price', 275,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  'b685a347-fe92-4e43-a551-0bbbaeafad6b',
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','2012 Barcelona Home Jersey Iniesta',
    'description',E'FC Barcelona 2011/12 home jersey\nIniesta name and number 8 on back\nSize small\nBlaugrana stripes, Qatar Foundation sponsor',
    'size','small',
    'colors',jsonb_build_array('red','navy'),
    'listed', '2026-02-03T11:30:00+00:00'::timestamptz,
    'price', 123,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  '96939086-b537-4032-b547-53d7c467a77d',
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2008 Manchester United Home Jersey Ronaldo',
    'description',E'Manchester United 2007/08 Champions League season jersey\nRonaldo number 7 on back\nSize large\nAIG sponsor, red with white collar',
    'size','large',
    'colors',jsonb_build_array('red','white','black'),
    'listed', '2026-02-14T08:45:00+00:00'::timestamptz,
    'price', 164,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  '45a5e8da-9ef0-4301-b021-9f9318877a91',
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2010 Netherlands World Cup Jersey',
    'description',E'Netherlands 2010 World Cup home jersey\nFinalists in South Africa, orange with black trim\nSize XL\nUnprinted, no name or number',
    'size','xlarge',
    'colors',jsonb_build_array('orange','black','white'),
    'listed', '2026-02-28T16:00:00+00:00'::timestamptz,
    'price', 97,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  'dc77d159-4aea-4514-b208-8c3eea4865f4',
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2016 Real Madrid Third Jersey',
    'description',E'Real Madrid 2015/16 Champions League winner third kit\nAll purple with gold trim\nSize medium\nUnsponsored player issue',
    'size','medium',
    'colors',jsonb_build_array('purple','gold'),
    'listed', '2026-03-05T12:20:00+00:00'::timestamptz,
    'price', 75,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  'b94d22a4-da78-40cc-8dca-3144ae30e962',
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','1994 AC Milan Home Jersey Maldini',
    'description',E'AC Milan 1993/94 Serie A jersey\nMaldini number 3, match worn condition\nSize medium\nClassic Lotto, Mediolanum sponsor era',
    'size','medium',
    'colors',jsonb_build_array('red','black'),
    'listed', '2026-03-19T10:10:00+00:00'::timestamptz,
    'price', 100,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO kit_listing(id, seller, data)
VALUES (
  'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2019 USA Women World Cup Jersey Morgan',
    'description',E'USA Women''s National Team 2019 World Cup home jersey\nAlex Morgan number 13 on back\nSize small\nWhite with red and blue details, Nike Dri-FIT',
    'size','small',
    'colors',jsonb_build_array('white','red','blue'),
    'listed', '2026-04-01T07:30:00+00:00'::timestamptz,
    'price', 150,
    'image', '/blankJersey.jpg',
    'quantity', 1
  )
);

INSERT INTO wishlist(kit_listing, shopper, data)
VALUES (
  'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  jsonb_build_object(
    'added','2026-05-01T07:30:00+00:00'::timestamptz
  )
);

INSERT INTO wishlist(kit_listing, shopper, data)
VALUES (
  'b685a347-fe92-4e43-a551-0bbbaeafad6b',
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  jsonb_build_object(
    'added','2026-05-01T07:45:00+00:00'::timestamptz
  )
);

INSERT INTO wishlist(kit_listing, shopper, data)
VALUES (
  '5e25b4f0-2ef4-4ec0-8ae0-e97ca701eb74',
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  jsonb_build_object(
    'added','2026-05-02T16:47:00+00:00'::timestamptz
  )
);


INSERT INTO wishlist(kit_listing, shopper, data)
VALUES (
  'b94d22a4-da78-40cc-8dca-3144ae30e962',
  '3436e28c-8d0f-42e1-a733-eb42358ca451',
  jsonb_build_object(
    'added','2026-04-28T03:54:00+00:00'::timestamptz
  )
);

INSERT INTO wishlist(kit_listing, shopper, data)
VALUES (
  'b685a347-fe92-4e43-a551-0bbbaeafad6b',
  '3436e28c-8d0f-42e1-a733-eb42358ca451',
  jsonb_build_object(
    'added','2026-04-30T21:14:00+00:00'::timestamptz
  )
);

INSERT INTO shoppingcart(kit_listing, shopper, data)
VALUES (
  'ad3852b2-2e1b-40e8-9400-668f6cfd2fe3',
  'e86405c1-545b-4bef-912c-a9b01ee6d18f',
  jsonb_build_object(
    'added','2026-05-01T07:30:00+00:00'::timestamptz
  )
);

DELETE FROM administrator;
INSERT INTO administrator(id, data)
VALUES (
  'd6a5c51f-443e-480a-a2ab-2c243cbd6502',
  jsonb_build_object(
    'email','dylan@kitgrail.com',
    'name','Dylan Paltiel',
    'pwhash',crypt('dylanadmin',gen_salt('bf'))
  )
);

INSERT INTO administrator(id, data)
VALUES (
  '8cfac7ca-2078-4d54-87b5-197b6b982a96',
  jsonb_build_object(
    'email','aldridge@kitgrail.com',
    'name','Aldridge Alegre',
    'pwhash',crypt('aldridgeadmin',gen_salt('bf'))
  )
);

INSERT INTO administrator(id, data)
VALUES (
  '1eab9086-7855-437c-9982-1e7b50c598d4',
  jsonb_build_object(
    'email','ethan@kitgrail.com',
    'name','Ethan Vinh',
    'pwhash',crypt('ethanadmin',gen_salt('bf'))
  )
);

INSERT INTO administrator(id, data)
VALUES (
  'd3e9940e-7ca2-47a9-85dd-e4dc1ee134f4',
  jsonb_build_object(
    'email','sasha@kitgrail.com',
    'name','Sasha Skinderev',
    'pwhash',crypt('sashaadmin',gen_salt('bf'))
  )
);

INSERT INTO administrator(id, data)
VALUES (
  '2501f851-2c2f-40a6-ab77-b56f8a3eb949',
  jsonb_build_object(
    'email','drharrison@kitgrail.com',
    'name','David Harrison',
    'pwhash',crypt('drharrisonadmin',gen_salt('bf'))
  )
);

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
