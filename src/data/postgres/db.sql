-- Delete table if exists
DROP TYPE IF EXISTS role_type;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS role;

DROP table if EXISTS accommodation_room;
DROP table if EXISTS accommodation;

DROP table if EXISTS reservation_has_city;
DROP table if EXISTS reservation;
DROP table if EXISTS client;

DROP table if EXISTS distrit;
DROP table if EXISTS city;
DROP table if EXISTS country;


-- -----------------------------------------------------
-- Table `role`
-- -----------------------------------------------------
CREATE TYPE role_type AS ENUM ('MANAGER_ROLE', 'EMPLOYEE_ROLE');


CREATE TABLE  role (
id_role SERIAL PRIMARY KEY, -- Use SERIAL for auto-incrementing IDs
name role_type NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE "user" ( -- Use double quotes for reserved keywords like "user"
id_user SERIAL PRIMARY KEY, -- Use SERIAL for auto-incrementing IDs
fullname VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL,
password VARCHAR(200) NOT NULL,
id_role INT NOT NULL,
CONSTRAINT fk_user_role FOREIGN KEY (id_role)
REFERENCES role (id_role)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS country (
  id_country SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  code VARCHAR(10) NOT NULL UNIQUE  
);

-- -----------------------------------------------------
-- Table `city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS city (
  id_city SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  country_id INT NOT NULL,
  CONSTRAINT fk_city_country FOREIGN KEY (country_id)
    REFERENCES country (id_country)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `distrit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS distrit (
  id_distrit SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  city_id INT NOT NULL,
  CONSTRAINT fk_distrit_city FOREIGN KEY (city_id)
    REFERENCES city (id_city)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `accommodation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation (
  id_accommodation SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  category VARCHAR(45) NOT NULL,
  address VARCHAR(45) NOT NULL,
  rating INT NOT NULL,
  email VARCHAR(50) NULL,
  distrit_id_distrit INT NOT NULL,
  CONSTRAINT fk_accommodation_distrit FOREIGN KEY (distrit_id_distrit)
    REFERENCES distrit (id_distrit)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `accommodation_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation_room (
  id_accommodation_room SERIAL PRIMARY KEY,
  room_type VARCHAR(100) NOT NULL,
  price_usd NUMERIC(10,2),
  service_tax NUMERIC(10,2),
  rate_usd NUMERIC(10,2),
  price_pen NUMERIC(10,2),
  capacity INT NOT NULL,
  available BOOLEAN NOT NULL,
  accommodation_id INT NOT NULL,
  CONSTRAINT fk_hotel_room_hotel FOREIGN KEY (accommodation_id)
    REFERENCES accommodation (id_accommodation)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `client`
-- -----------------------------------------------------
CREATE TABLE  IF NOT EXISTS  "client" (
    id SERIAL PRIMARY KEY,
    "fullName" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de última actualización
);


-- Crear índices para optimizar consultas
CREATE INDEX idx_full_name ON "client" ("fullName");
CREATE INDEX idx_email ON "client" ("email");

ALTER TABLE "client"
 RENAME COLUMN "region" to "continent"


-- -----------------------------------------------------
-- Table `reservation`
-- -----------------------------------------------------
CREATE TYPE reservation_status AS ENUM (
    'ACTIVE',
    'PENDING',
    'COMPLETED',
    'CANCELATED'
);

CREATE TYPE reservation_traveler_style AS ENUM (
    'STANDARD',
    'COMFORT',
    'LUXUS'
);


CREATE TYPE reservation_order_type AS ENUM (
    'DIRECT',
    'INDIRECT'
);

ALTER TYPE reservation_traveler_style
RENAME VALUE 'STANDART' TO 'STANDARD';




CREATE TABLE IF NOT EXISTS  "reservation" (
    id SERIAL PRIMARY KEY,
    "number_of_people" INT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "traveler_style" reservation_traveler_style NOT NULL, -- Nivel de confort
    "status" reservation_status DEFAULT "PENDING" NOT NULL,
    "order_type" reservation_order_type DEFAULT 'DIRECT' NOT NULL,
    "additional_specifications" TEXT, -- Especificaciones adicionales
    "code" VARCHAR(50) NOT NULL, -- Código de la reserva
    "clientId" INT NOT NULL, -- Relación con la tabla Client
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de última actualización
    CONSTRAINT fk_client FOREIGN KEY ("clientId") REFERENCES "client" (id) ON DELETE CASCADE
);

ALTER TABLE "reservation"
ADD COLUMN "order_type" reservation_order_type DEFAULT 'DIRECT' NOT NULL;


ALTER TABLE "reservation"
ALTER COLUMN "traveler_style" reservation_traveler_style DEFAULT 'STANDART' NOT NULL;

ALTER TABLE "reservation"
ALTER COLUMN "traveler_style" TYPE reservation_traveler_style
USING "traveler_style"::reservation_traveler_style;

ALTER TABLE "reservation"
ALTER COLUMN "traveler_style" SET NOT NULL;

ALTER TABLE "reservation"
ALTER COLUMN "order_type" DROP DEFAULT;





-- -----------------------------------------------------
-- Table `reservation_has_city` -- Crear la tabla 'reservation_has_city' para la relación muchos a muchos
-- -----------------------------------------------------
CREATE TABLE reservation_has_city (
  city_id INT,                            -- ID de la ciudad (clave foránea)
  reservation_id INT,                     -- ID de la reserva (clave foránea)
  PRIMARY KEY (city_id, reservation_id),  -- Combinación única de city_id y reservation_id
  FOREIGN KEY (city_id) REFERENCES city(id_city) ON DELETE CASCADE,        -- Relación con la tabla 'city'
  FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE CASCADE -- Relación con la tabla 'reservation'
);

select * from "reservation";