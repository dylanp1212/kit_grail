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

DROP TABLE IF EXISTS wishlist CASCADE;
CREATE TABLE wishlist(
  kit_listing UUID NOT NULL REFERENCES kit_listing(id) ON DELETE CASCADE,
  shopper UUID NOT NULL REFERENCES shopper(id) ON DELETE CASCADE,
  data jsonb,
  PRIMARY KEY (kit_listing, shopper)
);


DROP TABLE IF EXISTS shoppingcart CASCADE;
CREATE TABLE shoppingcart(
  kit_listing UUID NOT NULL REFERENCES kit_listing(id) ON DELETE CASCADE,
  shopper UUID NOT NULL REFERENCES shopper(id) ON DELETE CASCADE,
  data jsonb
);

DROP TABLE IF EXISTS api_key CASCADE;
CREATE TABLE api_key(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  seller UUID NOT NULL REFERENCES seller(id) ON DELETE CASCADE,
  data jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_api_key_prefix ON api_key((data->>'prefix'));

DROP TABLE IF EXISTS administrator CASCADE;
CREATE TABLE administrator(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb
);

DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;

CREATE TABLE orders(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  shopper UUID NOT NULL REFERENCES shopper(id) ON DELETE CASCADE,
  data jsonb
);

CREATE TABLE order_item(
  id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kit_listing UUID REFERENCES kit_listing(id) ON DELETE SET NULL,
  data jsonb
);