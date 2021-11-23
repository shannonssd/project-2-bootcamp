import pg from 'pg';
import { DateTime } from 'luxon';

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
  const getApptsQuery = 'SELECT  patients.name , patients.relationship , hospital_visits.date , hospitals.name AS hospital, departments.name as department, appointments.time  FROM patients INNER JOIN hospital_visits ON patients.id = hospital_visits.patient_id INNER JOIN appointments ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id;';
  pool.query(getApptsQuery).then((apptsResult) => {
    const apptData = [];
    const apptArray = apptsResult.rows;
    for (let i = 0; i < apptArray.length; i += 1) {
      apptData.push(Object.values(apptArray[i]));
    }
    for (let k = 0; k < apptData.length; k += 1) {
      apptData[k][2] = DateTime.fromISO(apptData[k][2]).toFormat('dd-MMM-yyyy');
    }
    return pool.query('SELECT id FROM appointments').then((apptIdResults) => {
      const apptIdArray = [];
      const apptIdList = apptIdResults.rows;
      for (let j = 0; j < apptIdList.length; j += 1) {
        apptIdArray.push(apptIdList[j].id);
      }

      apptData.push(apptIdArray);
      // return pool.query('SELECT id FROM hospital_visit').then
      res.render('home', { apptData });
    });
  });
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
      res.redirect('/add-info-new');
    });
  } else {
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
  console.log(req.body);
  pool.query('SELECT id FROM patients WHERE name = $1', [req.body['patient-name']]).then((patientResults) => {
    const patientID = patientResults.rows[0].id;
    return pool.query('SELECT id FROM hospitals WHERE name = $1', [req.body.hospital]).then((hospResults) => {
      const hospitalID = hospResults.rows[0].id;
      const visitData = [req.body.date, hospitalID, patientID];
      return pool.query('INSERT INTO hospital_visits (date, hospital_id, patient_id) VALUES ($1, $2, $3) RETURNING *', visitData).then((insertResults) => {
        const visitID = insertResults.rows[0].id;
        // ?????? Use req.body.department.length to run loop
        return pool.query('SELECT id FROM departments WHERE name = $1', [req.body.department]).then((departmentResults) => {
          const departmentID = departmentResults.rows[0].id;
          const appointmentData = [visitID, departmentID, req.body.time];
          return pool.query('INSERT INTO appointments (visit_id, department_id, time) VALUES ($1, $2, $3)', appointmentData).then((apptResults) => {
            res.redirect('/');
          });
        });
      });
    });
  });
};

export const editApptForm = (req, res) => {
  res.render('edit-appt');
};

export const editAppt = (req, res) => {
  // Store visit_id and appt_id -> retrieve date, time.
  // Compare to new req.body date and time
  // If date diff -> delete appt & add new hospital_visit & appt
  // If only time change then ALTER appointments table
};

export const deleteAppt = (req, res) => {
  const appointmentID = Object.keys(req.query)[0];
  pool.query('DELETE FROM appointments WHERE id = $1', [appointmentID]).then((deleteResult) => {
    res.redirect('/');
  });
};

// After add appt form change and edit appt form:
// 1. Nav bar
// 2. Session auth
// 3. Carousell tryout;
