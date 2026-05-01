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
INSERT INTO kit_listing(seller, data)
VALUES (
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'title','2014 Argentina Messi Jersey',
    'description','Messi Jersey\n2014 Argentina home jersey\nSize large\nBlue and white',
    'size','large',
    'colors',jsonb_build_array('blue','white'),
    'listed', '2026-03-15T06:34:00+00:00'::timestamptz,
    'price', 300,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);
INSERT INTO kit_listing(seller, data)
VALUES (
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'title','Random Jersey',
    'description','Some random jersey I found.\nI didnt even wash it',
    'size','small',
    'colors',jsonb_build_array('red','black'),
    'listed', '2026-03-16T16:04:00+00:00'::timestamptz,
    'price', 20,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);
INSERT INTO kit_listing(seller, data)
VALUES (
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','2006 Italy Home Jersey',
    'description','Italy 2006 World Cup home jersey\nWorn during their championship-winning campaign\nSize medium\nNavy blue with gold Adidas stripes',
    'size','medium',
    'colors',jsonb_build_array('navy','white','gold'),
    'listed', '2026-01-10T09:00:00+00:00'::timestamptz,
    'price', 134,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','1998 Brazil Away Jersey',
    'description','Brazil 1998 World Cup away jersey\nRare blue colorway from the Paris final\nSize large\nNike tick on chest',
    'size','large',
    'colors',jsonb_build_array('blue','white'),
    'listed', '2026-01-22T14:15:00+00:00'::timestamptz,
    'price', 275,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  '1830b53f-b49a-47eb-9a0e-d133a2bf5c3a',
  jsonb_build_object(
    'title','2012 Barcelona Home Jersey Iniesta',
    'description','FC Barcelona 2011/12 home jersey\nIniesta name and number 8 on back\nSize small\nBlaugrana stripes, Qatar Foundation sponsor',
    'size','small',
    'colors',jsonb_build_array('red','navy'),
    'listed', '2026-02-03T11:30:00+00:00'::timestamptz,
    'price', 123,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2008 Manchester United Home Jersey Ronaldo',
    'description','Manchester United 2007/08 Champions League season jersey\nRonaldo number 7 on back\nSize large\nAIG sponsor, red with white collar',
    'size','large',
    'colors',jsonb_build_array('red','white','black'),
    'listed', '2026-02-14T08:45:00+00:00'::timestamptz,
    'price', 164,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2010 Netherlands World Cup Jersey',
    'description','Netherlands 2010 World Cup home jersey\nFinalists in South Africa, orange with black trim\nSize XL\nUnprinted, no name or number',
    'size','xlarge',
    'colors',jsonb_build_array('orange','black','white'),
    'listed', '2026-02-28T16:00:00+00:00'::timestamptz,
    'price', 97,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2016 Real Madrid Third Jersey',
    'description','Real Madrid 2015/16 Champions League winner third kit\nAll purple with gold trim\nSize medium\nUnsponsored player issue',
    'size','medium',
    'colors',jsonb_build_array('purple','gold'),
    'listed', '2026-03-05T12:20:00+00:00'::timestamptz,
    'price', 75,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','1994 AC Milan Home Jersey Maldini',
    'description','AC Milan 1993/94 Serie A jersey\nMaldini number 3, match worn condition\nSize medium\nClassic Lotto, Mediolanum sponsor era',
    'size','medium',
    'colors',jsonb_build_array('red','black'),
    'listed', '2026-03-19T10:10:00+00:00'::timestamptz,
    'price', 100,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

INSERT INTO kit_listing(seller, data)
VALUES (
  'b04b15ce-0664-4b91-8c11-463f1e45305c',
  jsonb_build_object(
    'title','2019 USA Women World Cup Jersey Morgan',
    'description','USA Women''s National Team 2019 World Cup home jersey\nAlex Morgan number 13 on back\nSize small\nWhite with red and blue details, Nike Dri-FIT',
    'size','small',
    'colors',jsonb_build_array('white','red','blue'),
    'listed', '2026-04-01T07:30:00+00:00'::timestamptz,
    'price', 150,
    'image', 'http://localhost:3000/blankJersey.jpg'
  )
);

