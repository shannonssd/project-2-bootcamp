import pg from 'pg';

const { Pool } = pg;

let pgConnectionConfigs;
if (process.env.ENV === 'PRODUCTION') {
  pgConnectionConfigs = {
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'appointment_app_test',
    port: 5432,
  };
} else {
  pgConnectionConfigs = {
    user: 'shannon',
    host: 'localhost',
    database: 'appointment_app_test',
    port: 5432,
  };
}

const pool = new Pool(pgConnectionConfigs);

export const mainPage = (req, res) => {
  res.render('main');
};

export const homePage = (req, res) => {
  res.render('home');
};

export const newInfoForm = (req, res) => {
  res.render('add-info');
};

export const newInfo = (req, res) => {
};

export const newInfoDisplay = (req, res) => {
  res.render('add-info-new');
};

export const addApptForm = (req, res) => {
  res.render('add-appt');
};

export const addAppt = (req, res) => {
};

export const editApptForm = (req, res) => {
  res.render('edit-appt');
};

export const editAppt = (req, res) => {
};

export const deleteAppt = (req, res) => {
};
