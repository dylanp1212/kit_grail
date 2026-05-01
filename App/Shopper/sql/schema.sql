DROP TABLE IF EXISTS shopper CASCADE;
CREATE TABLE shopper(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb
);

DROP TABLE IF EXISTS seller CASCADE;
CREATE TABLE seller(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb
);

DROP TABLE IF EXISTS kit_listing CASCADE;
CREATE TABLE kit_listing(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  seller UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
  data jsonb
);
