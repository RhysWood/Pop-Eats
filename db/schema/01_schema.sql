DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS items CASCADE;

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY NOT NULL,
  "name" varchar(50) NOT NULL,
  "email" varchar(60) NOT NULL,
  "password" varchar(50) NOT NULL,
  "phone_number" bigint NOT NULL,
  "is_owner" boolean NOT NULL
);


