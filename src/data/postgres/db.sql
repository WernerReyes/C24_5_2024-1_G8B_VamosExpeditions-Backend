-- Delete table if exists
DROP TYPE role_type CASCADE;
DROP TYPE trip_details_traveler_style  CASCADE;
DROP TYPE trip_details_order_type CASCADE;
DROP TYPE reservation_status CASCADE;
DROP TYPE version_quotation_status CASCADE;


DROP table if EXISTS reservation;
DROP TABLE IF EXISTS hotel_room_trip_details;
DROP TABLE IF EXISTS trip_details;
DROP TABLE IF EXISTS version_quotation;
DROP TABLE IF EXISTS quotation;

DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS role;

DROP table if EXISTS hotel_room;
DROP table if EXISTS hotel;

DROP table if EXISTS trip_details_has_city;
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

ALTER TABLE role
ADD COLUMN name role_type  NOT NULL UNIQUE;

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
  name VARCHAR(45) NOT NULL UNIQUE,
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
    ON UPDATE NO ACTION,
  UNIQUE (name, country_id)
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
    ON UPDATE NO ACTION,
  UNIQUE (name, city_id)
);

-- -----------------------------------------------------
-- Table `hotel`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel (
  id_hotel SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('2','3', '4', '5', 'BOUTIQUE', 'VILLA', 'LODGE')),
  address VARCHAR(100) NULL,
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
  season_type VARCHAR(50) NULL,
  price_usd NUMERIC(10,2) NULL,
  service_tax NUMERIC(6,2) NULL,
  rate_usd NUMERIC(10,2) NULL,
  price_pen NUMERIC(10,2) NULL,
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
CREATE TABLE  IF NOT EXISTS  client (
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
CREATE TYPE  version_quotation_status AS ENUM ('DRAFT', 'COMPLETED', 'CANCELATED');


  CREATE TABLE IF NOT EXISTS version_quotation (
    version_number INT NOT NULL,
    quotation_id INT NOT NULL,
    indirect_cost_margin DECIMAL(5, 2),
    name VARCHAR(100) NOT NULL,
    profit_margin DECIMAL(5, 2),
    final_price DECIMAL(10, 2),
    completion_percentage INT DEFAULT 0 NOT NULL,
    status version_quotation_status DEFAULT 'DRAFT' NOT NULL, -- Custom ENUM type (defined previously)
    official BOOLEAN DEFAULT FALSE NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (version_number, quotation_id),
    CONSTRAINT fk_version_quotation_user FOREIGN KEY (user_id) REFERENCES "user" (id_user) ON DELETE CASCADE,
    CONSTRAINT fk_version_quotation_quotation FOREIGN KEY (quotation_id) REFERENCES quotation (id_quotation) ON DELETE CASCADE,
    CONSTRAINT chk_completion_percentage CHECK (completion_percentage IN (0, 25, 50, 75, 100)),
);

ALTER TABLE version_quotation ADD CONSTRAINT unique_official 
    UNIQUE (quotation_id) WHERE official = TRUE;


-- Add an index on quotation_id for faster lookups if needed:
CREATE INDEX idx_quotation_id ON version_quotation (quotation_id);
CREATE INDEX idx_version_number ON version_quotation (version_number);

CREATE UNIQUE INDEX unique_official_idx 
ON version_quotation (quotation_id) 
WHERE official = TRUE;


ALTER TABLE version_quotation 
ADD COLUMN status version_quotation_status DEFAULT 'DRAFT' NOT NULL;




-- -----------------------------------------------------
-- Table `trip_details`
-- -----------------------------------------------------
CREATE TYPE trip_details_traveler_style AS ENUM ('STANDARD', 'COMFORT', 'LUXUS');
CREATE TYPE  trip_details_order_type AS ENUM (
    'DIRECT',
    'INDIRECT'
);
DROP TABLE IF EXISTS trip_details;
CREATE TABLE trip_details (
	id SERIAL PRIMARY KEY,
	version_number INT NOT NULL,
	quotation_id INT NOT NULL,
	start_date DATE NOT NULL,
	end_date DATE NOT NULL,
	number_of_people INT NOT NULL,
	traveler_style trip_details_traveler_style NOT NULL,
	code VARCHAR(50) NOT NULL,
	order_type trip_details_order_type NOT NULL,
	additional_specifications TEXT,
	client_id INT NOT NULL,
	CONSTRAINT fk_trip_details_client FOREIGN KEY (client_id) REFERENCES client (id) ON DELETE CASCADE,
	CONSTRAINT fk_trip_details_version FOREIGN KEY (version_number, quotation_id) REFERENCES version_quotation (version_number, quotation_id) ON DELETE CASCADE,
	CONSTRAINT unique_version_id UNIQUE (version_number, quotation_id)
);

-- -----------------------------------------------------
-- Table `trip_details_has_city` -- Crear la tabla 'reservation_has_city' para la relación muchos a muchos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_details_has_city (
  trip_details_id INT,                            -- ID de la ciudad (clave foránea)
  city_id INT,                     -- ID de la reserva (clave foránea)
  PRIMARY KEY (city_id, trip_details_id),  -- Combinación única de city_id y reservation_id
  FOREIGN KEY (city_id) REFERENCES city(id_city) ON DELETE CASCADE,        -- Relación con la tabla 'city'
  FOREIGN KEY (trip_details_id) REFERENCES trip_details(id) ON DELETE CASCADE -- Relación con la tabla 'reservation'
);



-- -----------------------------------------------------
-- Table `reservation`
-- -----------------------------------------------------
CREATE TYPE  reservation_status AS ENUM (
    'ACCEPTED', 
    'REJECTED'
);

CREATE TABLE IF NOT EXISTS reservation (
    id SERIAL PRIMARY KEY,
    trip_details_id INT NOT NULL UNIQUE,  -- Se enlaza solo con trip_details
    status reservation_status DEFAULT 'ACCEPTED' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_reservation_trip_details FOREIGN KEY (trip_details_id) 
        REFERENCES trip_details(id) ON DELETE CASCADE
);


-- -----------------------------------------------------
-- Table `hotel_room_quotation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel_room_trip_details (
  id SERIAL PRIMARY KEY,
  hotel_room_id INT NOT NULL,
  date DATE NOT NULL,
  trip_details_id INT NOT NULL,  -- Ahora se enlaza solo con trip_details
  number_of_people INT NOT NULL,
  CONSTRAINT fk_hotel_room_quotation_hotel_room FOREIGN KEY (hotel_room_id) REFERENCES hotel_room(id_hotel_room) ON DELETE CASCADE,
  CONSTRAINT fk_hotel_room_quotation_trip_details FOREIGN KEY (trip_details_id) REFERENCES trip_details(id) ON DELETE CASCADE,
  CONSTRAINT unique_hotel_per_trip UNIQUE (hotel_room_id, date, trip_details_id)
);