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

DELETE FROM kit_listing;
INSERT INTO kit_listing(seller, data)
VALUES (
  'cc34e0f8-a81f-45df-8ff0-9f9cdac872b0',
  jsonb_build_object(
    'title','2014 Argentina Messi Jersey',
    'description','Messi Jersey\n2014 Argentina home jersey\nSize large\nBlue and white',
    'size','large',
    'colors',jsonb_build_array('blue','white')
  )
);
