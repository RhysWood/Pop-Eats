DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS orders_items CASCADE;

CREATE TABLE "items" (
  "id" SERIAL PRIMARY KEY,
  "title" varchar(50),
  "description" varchar(250),
  "price" decimal,
  "rating" int
);

<<<<<<< HEAD
CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(250),
  "email" varchar(250),
  "password" varchar(250),
  "phone_number" bigint,
  "is_owner" boolean
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "submitted" boolean,
  "start_date" date,
  "end_date" date
);

CREATE TABLE "orders_items" (
=======
CREATE TABLE "items" (
>>>>>>> routes
  "id" SERIAL PRIMARY KEY,
  "item_id" int,
  "order_id" int,
  "quantity" int
);

<<<<<<< HEAD
ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "orders_items" ADD FOREIGN KEY ("item_id") REFERENCES "items" ("id");
ALTER TABLE "orders_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

=======
CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  -- "user_id" INTEGER NOT NULL,
  "user_id" INTEGER REFERENCES users(id) ON DELETE CASCADE,
  -- "item_id" INTEGER NOT NULL,
  "item_id" INTEGER REFERENCES items(id) ON DELETE CASCADE,
  "quantity" INTEGER NOT NULL
);

-- CREATE TABLE "items" (
--   "id" SERIAL PRIMARY KEY,
--   "title" varchar(250),
--   "description" varchar(250),
--   "price" INTEGER NOT NULL,
--   "rating" INTEGER NOT NULL
-- );

-- ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- ALTER TABLE "items" ADD FOREIGN KEY ("id") REFERENCES "orders" ("item_id");
>>>>>>> routes
