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

// eslint-disable-next-line prefer-const
let newInfoArray = [];
export const newInfo = (req, res) => {
  newInfoArray = [];
  const newPatient = req.body['new-patient'];
  const { relationship } = req.body;
  const newHospital = req.body['new-hospital'];
  const newDepartment = req.body['new-department'];

  if (newPatient !== '') {
    const patientArray = [newPatient, relationship];
    const patientQuery = 'INSERT INTO patients (name, relationship) VALUES ($1, $2) RETURNING *';
    pool.query(patientQuery, patientArray).then((patientResult) => {
      newInfoArray.push({ 'Patient Name': `${patientResult.rows[0].name}` });
      newInfoArray.push({ 'Relationship to User': `${patientResult.rows[0].relationship}` });
    });
  }
  if (newHospital !== '') {
    const hospitalArray = [newHospital];
    const hospitalQuery = 'INSERT INTO hospitals (name) VALUES ($1) RETURNING *';
    pool.query(hospitalQuery, hospitalArray).then((hospitalResult) => {
      newInfoArray.push({ 'New Hospital': `${hospitalResult.rows[0].name}` });
    });
  }
  if (newDepartment !== '') {
    const departmentArray = [newDepartment];
    const departmentQuery = 'INSERT INTO departments (name) VALUES ($1) RETURNING *';
    pool.query(departmentQuery, departmentArray).then((departmentResult) => {
      newInfoArray.push({ 'New Department': `${departmentResult.rows[0].name}` });
      // console.log(newInfoArray);
      console.log('INSIDE LAWST QUERY');
      res.redirect('/add-info-new');
    });
  } else {
    console.log('AFTER LAWST QUERY');

    res.redirect('/add-info-new');
  }
};

export const newInfoDisplay = (req, res) => {
  res.render('add-info-new', { newInfoArray });
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
