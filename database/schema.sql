-- =====================================================
-- Laxmi Palace Lawn - MySQL 8.0 Database Schema
-- =====================================================

CREATE DATABASE IF NOT EXISTS laxmi_palace_lawn
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laxmi_palace_lawn;

-- -----------------------------------------------------
-- Table: admins
-- -----------------------------------------------------
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
  id            BIGINT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('SUPER_ADMIN','ADMIN') NOT NULL DEFAULT 'ADMIN',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_email (email)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: customers
-- -----------------------------------------------------
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  mobile     VARCHAR(20) NOT NULL,
  email      VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_customer_mobile (mobile),
  INDEX idx_customer_email (email)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: bookings
-- -----------------------------------------------------
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  customer_id BIGINT NOT NULL,
  event_date  DATE NOT NULL,
  event_type  VARCHAR(100) NOT NULL,
  guest_count INT NOT NULL DEFAULT 0,
  status      ENUM('PENDING','APPROVED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  notes       TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  INDEX idx_booking_date (event_date),
  INDEX idx_booking_status (status),
  -- Partial uniqueness via unique index on (event_date, status_for_unique)
  -- MySQL doesn't support filtered indexes, so we use a virtual column
  is_approved TINYINT GENERATED ALWAYS AS (IF(status = 'APPROVED', 1, NULL)) VIRTUAL,
  UNIQUE KEY uk_approved_date (event_date, is_approved)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: blocked_dates
-- -----------------------------------------------------
DROP TABLE IF EXISTS blocked_dates;
CREATE TABLE blocked_dates (
  id           BIGINT PRIMARY KEY AUTO_INCREMENT,
  blocked_date DATE NOT NULL UNIQUE,
  reason       VARCHAR(255),
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_blocked_date (blocked_date)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: payments
-- -----------------------------------------------------
DROP TABLE IF EXISTS payments;
CREATE TABLE payments (
  id             BIGINT PRIMARY KEY AUTO_INCREMENT,
  booking_id     BIGINT NOT NULL,
  amount         DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status ENUM('PENDING','PAID') NOT NULL DEFAULT 'PENDING',
  payment_date   TIMESTAMP NULL DEFAULT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_payment_booking (booking_id),
  INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB;
