-- Delete table if exists
DROP TABLE IF EXISTS hotel_room_quotation;
DROP TABLE IF EXISTS version_quotation;
DROP TABLE IF EXISTS quotation;

DROP TYPE IF EXISTS role_type;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS role;

DROP table if EXISTS hotel_room;
DROP table if EXISTS hotel;

DROP table if EXISTS reservation_has_city;
DROP table if EXISTS reservation;
DROP table if EXISTS client;

DROP table if EXISTS distrit;
DROP table if EXISTS city;
DROP table if EXISTS country;



-- -----------------------------------------------------
-- Table `role`
-- -----------------------------------------------------
CREATE TYPE  role_type AS ENUM ('MANAGER_ROLE', 'EMPLOYEE_ROLE');


CREATE TABLE  role (
id_role SERIAL PRIMARY KEY, -- Use SERIAL for auto-incrementing IDs
name role_type NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" ( -- Use double quotes for reserved keywords like "user"
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
-- Table `hotel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel (
  id_hotel SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('3', '4', '5', 'BOUTIQUE', 'VILLA', 'LODGE')),
  address VARCHAR(45) NOT NULL,
  distrit_id INT NOT NULL,
  CONSTRAINT fk_hotel_distrit FOREIGN KEY (distrit_id)
    REFERENCES distrit (id_distrit)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);

-- -----------------------------------------------------
-- Table `hotel_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel_room (
  id_hotel_room SERIAL PRIMARY KEY,
  room_type VARCHAR(100) NOT NULL,
  price_usd NUMERIC(10,2),
  price_pen NUMERIC(10,2),
  capacity INT NOT NULL,
  hotel_id INT NOT NULL,
  CONSTRAINT fk_hotel_room_hotel FOREIGN KEY (hotel_id)
    REFERENCES hotel (id_hotel)
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
	"subregion" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Fecha de última actualización
);


-- Crear índices para optimizar consultas
CREATE INDEX idx_full_name ON "client" ("fullName");
CREATE INDEX idx_email ON "client" ("email");




-- -----------------------------------------------------
-- Table `reservation`
-- -----------------------------------------------------
CREATE TYPE  reservation_status AS ENUM (
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


CREATE TYPE  reservation_order_type AS ENUM (
    'DIRECT',
    'INDIRECT'
);


CREATE TABLE IF NOT EXISTS  "reservation" (
    id SERIAL PRIMARY KEY,
    "number_of_people" INT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "traveler_style" reservation_traveler_style NOT NULL, -- Nivel de confort
    "status" reservation_status DEFAULT 'PENDING' NOT NULL,
    "order_type" reservation_order_type DEFAULT 'DIRECT' NOT NULL,
    "additional_specifications" TEXT, -- Especificaciones adicionales
    "code" VARCHAR(50) NOT NULL, -- Código de la reserva
    "clientId" INT NOT NULL, -- Relación con la tabla Client
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de última actualización
    CONSTRAINT fk_client FOREIGN KEY ("clientId") REFERENCES "client" (id) ON DELETE CASCADE
);



-- -----------------------------------------------------
-- Table `reservation_has_city` -- Crear la tabla 'reservation_has_city' para la relación muchos a muchos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS reservation_has_city (
  city_id INT,                            -- ID de la ciudad (clave foránea)
  reservation_id INT,                     -- ID de la reserva (clave foránea)
  PRIMARY KEY (city_id, reservation_id),  -- Combinación única de city_id y reservation_id
  FOREIGN KEY (city_id) REFERENCES city(id_city) ON DELETE CASCADE,        -- Relación con la tabla 'city'
  FOREIGN KEY (reservation_id) REFERENCES reservation(id) ON DELETE CASCADE -- Relación con la tabla 'reservation'
);

-- -----------------------------------------------------
-- Table `quotation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS quotation (
  id_quotation SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
  

  
-- -----------------------------------------------------
-- Table `version_quotation`
-- -----------------------------------------------------
CREATE TYPE  quotation_status AS ENUM ('DRAFT', 'PENDING', 'ACCEPTED', 'REJECTED');
  CREATE TABLE IF NOT EXISTS version_quotation (
    indirect_cost_margin DECIMAL(5, 2),
    profit_margin DECIMAL(5, 2),
    total_cost DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    status quotation_status DEFAULT 'DRAFT' NOT NULL, -- Custom ENUM type (defined previously)
    official BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    version_number INT NOT NULL,
    quotation_id INT NOT NULL,
    reservation_id INT NULL UNIQUE,
    user_id INT NOT NULL,
    PRIMARY KEY (version_number, quotation_id),
    CONSTRAINT fk_version_quotation_user FOREIGN KEY (user_id) REFERENCES "user" (id_user) ON DELETE CASCADE,
    CONSTRAINT fk_version_quotation_reservation FOREIGN KEY (reservation_id) REFERENCES "reservation" (id) ON DELETE CASCADE,
    CONSTRAINT fk_version_quotation_quotation FOREIGN KEY (quotation_id) REFERENCES quotation (id_quotation) ON DELETE CASCADE
);

-- Add an index on quotation_id for faster lookups if needed:
CREATE INDEX idx_quotation_id ON version_quotation (quotation_id);
CREATE INDEX idx_version_number ON version_quotation (version_number);

-- -----------------------------------------------------
-- Table `hotel_room_quotation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel_room_quotation (
  id_hotel_room_quotation SERIAL PRIMARY KEY,
  number_of_people INT NOT NULL,
  day INT NOT NULL,
  hotel_room_id INT NOT NULL,
  version_number INT NOT NULL,
  quotation_id INT NOT NULL,
  CONSTRAINT fk_hotel_room_quotation_hotel_room FOREIGN KEY (hotel_room_id) REFERENCES "hotel_room" (id_hotel_room) ON DELETE CASCADE,
  CONSTRAINT fk_hotel_room_quotation_version_quotation FOREIGN KEY (version_number, quotation_id) REFERENCES "version_quotation" (version_number, quotation_id) ON DELETE CASCADE,
  CONSTRAINT unique_hotel_per_day UNIQUE (hotel_room_id, day, quotation_id, version_number)
);
