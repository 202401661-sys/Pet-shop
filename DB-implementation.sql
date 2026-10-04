-- DB implementation: Airbnb clone (PostgreSQL)
-- Run: psql -U postgres -d airbnb -f DB-implementation.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE listings (
  id SERIAL PRIMARY KEY,
  host_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  city VARCHAR(100),
  price_per_night NUMERIC(10,2) NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  listing_id INT NOT NULL REFERENCES listings(id),
  guest_id INT NOT NULL REFERENCES users(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  author_id INT NOT NULL REFERENCES users(id),
  listing_id INT NOT NULL REFERENCES listings(id),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  comment TEXT
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  payer_id INT NOT NULL REFERENCES users(id),
  amount NUMERIC(10,2) NOT NULL,
  paid_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(id),
  recipient_id INT NOT NULL REFERENCES users(id),
  booking_id INT REFERENCES bookings(id),
  body TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  host_id INT NOT NULL REFERENCES users(id),
  title VARCHAR(150) NOT NULL,
  price NUMERIC(10,2)
);

CREATE TABLE aircover_claims (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL REFERENCES bookings(id),
  claimant_id INT NOT NULL REFERENCES users(id),
  description TEXT,
  status VARCHAR(20) DEFAULT 'open'
);
