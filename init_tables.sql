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
date DATE,
hospital_id INTEGER,
patient_id INTEGER
);

CREATE TABLE IF NOT EXISTS appointments (
id SERIAL PRIMARY KEY,
visit_id INTEGER,
department_id INTEGER,
time TIME
);

CREATE TABLE IF NOT EXISTS hospitals (
id SERIAL PRIMARY KEY,
name TEXT
);

CREATE TABLE IF NOT EXISTS departments (
id SERIAL PRIMARY KEY,
name TEXT
);

SELECT patients.id, patients.name AS patient_name, patients.relationship, hospital_visits.date, hospitals.name AS hospital, departments.name as department, appointments.time FROM patients INNER JOIN hospital_visits ON patients.id = hospital_visits.patient_id INNER JOIN appointments ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id;

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

SELECT prescriptions.id, patients.name AS patient_name, patients.relationship, medications.name AS medication_name, prescriptions.dosage FROM prescriptions INNER JOIN patients ON patients.id = prescriptions.patient_id INNER JOIN medications ON prescriptions.medication_id = medications.id;