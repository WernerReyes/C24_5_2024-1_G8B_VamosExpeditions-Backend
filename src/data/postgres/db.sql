-- QUERY TRUNCATED
-- Delete table if exists
DROP TYPE if exists role_type CASCADE;
DROP TYPE if exists trip_details_traveler_style  CASCADE;
DROP TYPE if exists trip_details_order_type CASCADE;
DROP TYPE if exists reservation_status CASCADE;
DROP TYPE if exists version_quotation_status CASCADE;


DROP table if EXISTS reservation;
DROP TABLE IF EXISTS hotel_room_trip_details;
DROP TABLE IF EXISTS trip_details;
DROP TABLE IF EXISTS version_quotation;
DROP TABLE IF EXISTS quotation;


DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS partner;
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
name role_type NOT NULL UNIQUE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

  -- Soft Delete
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  delete_reason TEXT,
);

-- -----------------------------------------------------
-- Table `user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" ( -- Use double quotes for reserved keywords like "user"
id_user SERIAL PRIMARY KEY, -- Use SERIAL for auto-incrementing IDs
fullname VARCHAR(45) NOT NULL,
email VARCHAR(45) NOT NULL,
password VARCHAR(200) NOT NULL,
description TEXT NULL,
phone_number VARCHAR(20) NULL,
id_role INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

  -- Soft Delete
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  delete_reason TEXT,
  
CONSTRAINT fk_user_role FOREIGN KEY (id_role)
REFERENCES role (id_role)
ON DELETE NO ACTION
ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table `notification`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS notification (
    id SERIAL PRIMARY KEY,
    from_user INT NOT NULL,
    to_user INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_from FOREIGN KEY (from_user)
        REFERENCES "user"(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_notifications_to FOREIGN KEY (to_user)
        REFERENCES "user"(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- -----------------------------------------------------
-- Table `country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS country (
  id_country SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
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
-- Table `Partner`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS partner (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
  
-- -----------------------------------------------------
-- Table `version_quotation`
-- -----------------------------------------------------
CREATE TYPE  version_quotation_status AS ENUM ('DRAFT', 'COMPLETED', 'CANCELATED', 'APPROVED');


  CREATE TABLE IF NOT EXISTS version_quotation (
    version_number INT NOT NULL,
    quotation_id INT NOT NULL,
    indirect_cost_margin DECIMAL(5, 2),
    name TEXT NOT NULL,
    profit_margin DECIMAL(5, 2),
    final_price DECIMAL(10, 2),
    completion_percentage INT DEFAULT 0 NOT NULL,
    status version_quotation_status DEFAULT 'DRAFT' NOT NULL, -- Custom ENUM type (defined previously)
    official BOOLEAN DEFAULT FALSE NOT NULL,
    user_id INT NOT NULL,
    partner_id INT NULL DEFAULT NULL,
    commission DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

   -- Soft Delete
   is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
   deleted_at TIMESTAMP NULL DEFAULT NULL,
   delete_reason TEXT,
    
    PRIMARY KEY (version_number, quotation_id),
    CONSTRAINT fk_version_quotation_user FOREIGN KEY (user_id) REFERENCES "user" (id_user) ON DELETE CASCADE,
    CONSTRAINT fk_version_quotation_quotation FOREIGN KEY (quotation_id) REFERENCES quotation (id_quotation) ON DELETE CASCADE,
    CONSTRAINT chk_completion_percentage CHECK (completion_percentage IN (0, 25, 50, 75, 100)),
    CONSTRAINT fk_version_quotation_partner FOREIGN KEY (partner_id) REFERENCES partner(id) ON DELETE CASCADE,
    CONSTRAINT version_quotation_commission_check CHECK (commission = 0 OR commission BETWEEN 3 AND 20);
);


-- INDEXS
-- Índice compuesto en quotation_id y official
CREATE INDEX idx_quotation_id_official ON version_quotation(quotation_id, official);

-- Índice en name
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_name_trgm ON version_quotation USING GIN (name gin_trgm_ops);

-- Indice en unique official
CREATE UNIQUE INDEX unique_official_idx 
ON version_quotation (quotation_id) 
WHERE official = TRUE;

-- -----------------------------------------------------
-- Table `trip_details`
-- -----------------------------------------------------
CREATE TYPE trip_details_traveler_style AS ENUM ('STANDARD', 'COMFORT', 'LUXUS');
CREATE TYPE  trip_details_order_type AS ENUM (
    'DIRECT',
    'INDIRECT'
);

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

-- INDEXS
-- Índice en client_id
CREATE INDEX idx_client_id ON trip_details(client_id);

-- Índice en start_date
CREATE INDEX idx_startDate ON trip_details(start_date);

-- Índice en end_date
CREATE INDEX idx_endDate ON trip_details(end_date);


-- -----------------------------------------------------
-- Table `trip_details_has_city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS trip_details_has_city (
  trip_details_id INT,                  
  city_id INT,                 
  PRIMARY KEY (city_id, trip_details_id),
  FOREIGN KEY (city_id) REFERENCES city(id_city) ON DELETE CASCADE,        
  FOREIGN KEY (trip_details_id) REFERENCES trip_details(id) ON DELETE CASCADE 
);

-- -----------------------------------------------------
-- Table `hotel_room_quotation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel_room_trip_details (
  id SERIAL PRIMARY KEY,
  hotel_room_id INT NOT NULL,
  date DATE NOT NULL,
  trip_details_id INT NOT NULL,  
  cost_person DECIMAL(8,2) NOT NULL,
  CONSTRAINT fk_hotel_room_quotation_hotel_room FOREIGN KEY (hotel_room_id) REFERENCES hotel_room(id_hotel_room) ON DELETE CASCADE,
  CONSTRAINT fk_hotel_room_quotation_trip_details FOREIGN KEY (trip_details_id) REFERENCES trip_details(id) ON DELETE CASCADE
);


-- -----------------------------------------------------
-- Table `reservation`
-- -----------------------------------------------------
CREATE TYPE reservation_status AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');


CREATE TABLE IF NOT EXISTS reservation (
    id SERIAL PRIMARY KEY,
    quotation_id INT NOT NULL,
    status reservation_status DEFAULT 'PENDING' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

   -- Soft Delete
   is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
   deleted_at TIMESTAMP NULL DEFAULT NULL,
   delete_reason TEXT,
  
    CONSTRAINT fk_reservation_quotation FOREIGN KEY (quotation_id) 
    REFERENCES quotation(id_quotation) ON DELETE CASCADE,
    CONSTRAINT unique_reservation UNIQUE (quotation_id)
        
);
-- Índice en client_id
CREATE INDEX idx_status_r ON reservation(status);

-- Índice en created_at
CREATE INDEX idx_is_deleted_r ON reservation(is_deleted);

  
-- -----------------------------------------------------
-- View `reservation_version_summary`
-- -----------------------------------------------------
CREATE OR REPLACE VIEW reservation_version_summary AS
SELECT 
  r.created_at AS reservation_date,
  v.final_price,
  v.profit_margin,
  q.id_quotation AS quotation_id,
  v.version_number,
   r.status AS reservation_status, -- Add reservation status
  r.id AS id  -- Add a unique identifier
FROM reservation r
JOIN quotation q ON r.quotation_id = q.id_quotation
JOIN version_quotation v ON q.id_quotation = v.quotation_id
WHERE v.status = 'APPROVED' AND v.official = TRUE;