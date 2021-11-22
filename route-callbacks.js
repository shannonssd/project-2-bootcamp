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

// eslint-disable-next-line prefer-const
export const addApptForm = (req, res) => {
  // eslint-disable-next-line prefer-const
  let formData = [];
  const patientQuery = 'SELECT name FROM patients';
  const hospitalQuery = 'SELECT name FROM hospitals';
  const departmentQuery = 'SELECT name FROM departments';
  pool.query(patientQuery).then((patientResults) => {
    const patientDetails = patientResults.rows;
    formData.push(patientDetails);
    return pool.query(hospitalQuery).then((hospitalResults) => {
      const hospitalDetails = hospitalResults.rows;
      formData.push(hospitalDetails);
      return pool.query(departmentQuery).then((departmentResults) => {
        const departmentDetails = departmentResults.rows;
        formData.push(departmentDetails);
        res.render('add-appt', { formData });
      });
    });
  });
};

export const addAppt = (req, res) => {
  pool.query('SELECT id FROM patients WHERE name = $1', [req.body['patient-name']]).then((patientResults) => {
    const patientID = patientResults.rows[0].id;
    return pool.query('SELECT id FROM hospitals WHERE name = $1', [req.body.hospital]).then((hospResults) => {
      const hospitalID = hospResults.rows[0].id;
      console.log(patientID, hospitalID);
      const visitData = [req.body.date, hospitalID, patientID];
      return pool.query('INSERT INTO hospital_visits (date, hospital_id, patient_id) VALUES ($1, $2, $3) RETURNING *', visitData).then((insertResults) => {
        const visitID = insertResults.rows[0].id;
        return pool.query('SELECT id FROM departments WHERE name = $1', [req.body.department]).then((departmentResults) => {
          const departmentID = departmentResults.rows[0].id;
          const appointmentData = [visitID, departmentID, req.body.time];
          return pool.query('INSERT INTO appointments (visit_id, department_id, time) VALUES ($1, $2, $3)', appointmentData).then((apptResults) => {
            console.log('done!');
          });
        });
      });
    });
  });
  // // const hospitalVisitQuery = 'INSERT INTO ';
  // console.log(req.body['patient-name']);
  // // console.log(req.body['patient-name']);
  // console.log(req.body.hospital);
  // console.log(req.body.department);
  // console.log(req.body.time);
  // console.log(req.body.date);
};

export const editApptForm = (req, res) => {
  res.render('edit-appt');
};

export const editAppt = (req, res) => {
};

export const deleteAppt = (req, res) => {
};
