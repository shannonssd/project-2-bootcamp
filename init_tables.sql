CREATE TABLE IF NOT EXISTS users (
id SERIAL PRIMARY KEY,
email TEXT,
password TEXT
);

CREATE TABLE IF NOT EXISTS patients (
id SERIAL PRIMARY KEY,
name TEXT,
relationship TEXT
);

CREATE TABLE IF NOT EXISTS hospital_visits (
id SERIAL PRIMARY KEY,
date TEXT,
hospital_id INTEGER
);

CREATE TABLE IF NOT EXISTS appointments (
id SERIAL PRIMARY KEY,
visit_id INTEGER,
department_id INTEGER,
time TEXT,
patient_id INTEGER
);

CREATE TABLE IF NOT EXISTS hospitals (
id SERIAL PRIMARY KEY,
name TEXT
);

CREATE TABLE IF NOT EXISTS departments (
id SERIAL PRIMARY KEY,
name TEXT
);


CREATE TABLE IF NOT EXISTS medications (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id SERIAL PRIMARY KEY, 
  dosage INTEGER,
  patient_id INTEGER,
  medication_id INTEGER
);
