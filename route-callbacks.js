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
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const getApptsQuery = 'SELECT patients.name, patients.relationship, hospital_visits.date, hospitals.name AS hospital, departments.name as department, appointments.time FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id';

    pool.query(getApptsQuery).then((apptsResult) => {
      const apptArray = apptsResult.rows;
      // Get list of unique patient names
      const nameObj = {};
      for (let i = 0; i < apptArray.length; i += 1) {
        if (!(apptArray[i].name in nameObj)) {
          nameObj[apptArray[i].name] = apptArray[i].name;
        }
      }
      const nameArray = Object.values(nameObj);

      // Get list of unique hospital names
      const hospitalObj = {};
      for (let i = 0; i < apptArray.length; i += 1) {
        if (!(apptArray[i].hospital in hospitalObj)) {
          hospitalObj[apptArray[i].hospital] = apptArray[i].hospital;
        }
      }
      const hospitalArray = Object.values(hospitalObj);

      let sortMonthArray = [[], [], [], [], [], [], [], [], [], [], [], []];

      let apptData = [];
      for (let i = 0; i < apptArray.length; i += 1) {
        apptData.push(Object.values(apptArray[i]));
      }

      for (let k = 0; k < apptData.length; k += 1) {
        apptData[k][2] = DateTime.fromISO(apptData[k][2]).toFormat('dd-MMM-yyyy');
      }
      return pool.query('SELECT id FROM appointments').then((apptIdResults) => {
        const apptIdList = apptIdResults.rows;
        for (let j = 0; j < apptIdList.length; j += 1) {
          apptData[j].push(apptIdList[j].id);
        }
        const hospQuery = 'SELECT hospital_visits.id FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id';
        return pool.query(hospQuery).then((HospIdResults) => {
          const hospIdList = HospIdResults.rows;
          for (let k = 0; k < hospIdList.length; k += 1) {
            apptData[k].push(hospIdList[k].id);
          }
          apptData.sort((a, b) =>
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
            new Date(a[2]) - new Date(b[2]));

          // Filter by patients based on user's choice
          if (Object.keys(req.query)[0] === 'filter-patient') {
            console.log('filter working');
            const filteredName = req.query['filter-patient'];
            apptData = apptData.filter((element) => element[0] === filteredName);
            console.log(apptData);
          }

          // Filter by hospitals based on user's choice
          if (Object.keys(req.query)[0] === 'filter-hospital') {
            console.log('filter working');
            const filteredHospital = req.query['filter-hospital'];
            apptData = apptData.filter((element) => element[3] === filteredHospital);
            console.log(apptData);
          }
          sortMonthArray = [[], [], [], [], [], [], [], [], [], [], [], []];
          for (let m = 0; m < apptData.length; m += 1) {
            const date = apptData[m][2];
            const month = date.split('-')[1];
            if (month === 'Jan') {
              sortMonthArray[0].push(apptData[m]);
            }
            if (month === 'Feb') {
              sortMonthArray[1].push(apptData[m]);
            }
            if (month === 'Mar') {
              sortMonthArray[2].push(apptData[m]);
            }
            if (month === 'Apr') {
              sortMonthArray[3].push(apptData[m]);
            }
            if (month === 'May') {
              sortMonthArray[4].push(apptData[m]);
            }
            if (month === 'Jun') {
              sortMonthArray[5].push(apptData[m]);
            }
            if (month === 'Jul') {
              sortMonthArray[6].push(apptData[m]);
            }
            if (month === 'Aug') {
              sortMonthArray[7].push(apptData[m]);
            }
            if (month === 'Sep') {
              sortMonthArray[8].push(apptData[m]);
            }
            if (month === 'Oct') {
              sortMonthArray[9].push(apptData[m]);
            }
            if (month === 'Nov') {
              sortMonthArray[10].push(apptData[m]);
            }
            if (month === 'Dec') {
              sortMonthArray[11].push(apptData[m]);
            }
          }
          sortMonthArray.push(nameArray);
          sortMonthArray.push(hospitalArray);
          res.render('home', { sortMonthArray });
        });
      });
    });
  }
};

export const homePagePatient = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const getApptsQuery = 'SELECT patients.name, patients.relationship, hospital_visits.date, hospitals.name AS hospital, departments.name as department, appointments.time FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id';

    pool.query(getApptsQuery).then((apptsResult) => {
      const apptArray = apptsResult.rows;
      // Get list of unique patient names
      const nameObj = {};
      for (let i = 0; i < apptArray.length; i += 1) {
        if (!(apptArray[i].name in nameObj)) {
          nameObj[apptArray[i].name] = apptArray[i].name;
        }
      }
      const nameArray = Object.values(nameObj);

      // Get list of unique hospital names
      const hospitalObj = {};
      for (let i = 0; i < apptArray.length; i += 1) {
        if (!(apptArray[i].hospital in hospitalObj)) {
          hospitalObj[apptArray[i].hospital] = apptArray[i].hospital;
        }
      }

      const hospitalArray = Object.values(hospitalObj);

      let apptData = [];
      for (let i = 0; i < apptArray.length; i += 1) {
        apptData.push(Object.values(apptArray[i]));
      }

      for (let k = 0; k < apptData.length; k += 1) {
        apptData[k][2] = DateTime.fromISO(apptData[k][2]).toFormat('dd-MMM-yyyy');
      }

      return pool.query('SELECT id FROM appointments').then((apptIdResults) => {
        const apptIdList = apptIdResults.rows;
        for (let j = 0; j < apptIdList.length; j += 1) {
          apptData[j].push(apptIdList[j].id);
        }
        const hospQuery = 'SELECT hospital_visits.id FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id';
        return pool.query(hospQuery).then((HospIdResults) => {
          const hospIdList = HospIdResults.rows;
          for (let k = 0; k < hospIdList.length; k += 1) {
            apptData[k].push(hospIdList[k].id);
          }
          apptData.sort((a, b) =>
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
            new Date(a[2]) - new Date(b[2]));

          // Get list of unique months
          const monthsObj = {};
          const monthsTempArr = [];
          for (let i = 0; i < apptData.length; i += 1) {
            const date = apptData[i][2];
            const month = date.split('-')[1];
            if (!(month in monthsObj)) {
              monthsTempArr.push(month);
              // eslint-disable-next-line dot-notation
              monthsObj[monthsTempArr[monthsTempArr.length - 1]] = month;
            }
          }

          const monthsArray = Object.values(monthsObj);

          // Filter by patients based on user's choice
          if (Object.keys(req.query)[0] === 'filter-month') {
            console.log('filter working');
            const filteredMonth = req.query['filter-month'];
            apptData = apptData.filter((element) => element[2].split('-')[1] === filteredMonth);
            console.log(apptData);
          }

          // Filter by hospitals based on user's choice
          if (Object.keys(req.query)[0] === 'filter-hospital') {
            console.log('filter working');
            const filteredHospital = req.query['filter-hospital'];
            apptData = apptData.filter((element) => element[3] === filteredHospital);
            console.log(apptData);
          }

          const sortNameArray = [];
          for (let j = 0; j < nameArray.length; j += 1) {
            sortNameArray.push([]);
          }

          for (let m = 0; m < apptData.length; m += 1) {
            const name = apptData[m][0];
            for (let j = 0; j < nameArray.length; j += 1) {
              if (name === nameArray[j]) {
                sortNameArray[j].push(apptData[m]);
              }
            }
          }
          sortNameArray.push(nameArray);
          sortNameArray.push(hospitalArray);
          sortNameArray.push(monthsArray);
          res.render('home-patient', { sortNameArray });
        });
      });
    });
  }
};

export const newInfoForm = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info');
  }
};

// eslint-disable-next-line prefer-const
let newInfoArray = [];
export const newInfo = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    newInfoArray = [];
    const newPatient = req.body['new-patient'];
    const { relationship } = req.body;
    newInfoArray.push({ 'Patient Name': `${newPatient}` });
    newInfoArray.push({ 'Relationship to User': `${relationship}` });

    const patientArray = [newPatient, relationship];
    const patientQuery = 'INSERT INTO patients (name, relationship) VALUES ($1, $2) RETURNING *';
    pool.query(patientQuery, patientArray).then((patientResult) => {
      res.redirect('/add-info-new');
    });
  }
};

export const newInfoDisplay = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info-new', { newInfoArray });
  }
};

export const newInfoFormHos = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info-hos');
  }
};

let newInfoArrayHos = [];
export const newInfoHos = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    newInfoArrayHos = [];

    const newHospital = req.body['new-hospital'];
    newInfoArrayHos.push({ 'New Hospital': `${newHospital}` });

    const hospitalArray = [newHospital];
    const hospitalQuery = 'INSERT INTO hospitals (name) VALUES ($1) RETURNING *';
    pool.query(hospitalQuery, hospitalArray).then((hospitalResult) => {
      res.redirect('/add-info-new/hospital');
    });
  }
};

export const newInfoDisplayHos = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info-new-hos', { newInfoArrayHos });
  }
};

export const newInfoFormDep = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info-dep');
  }
};

let newInfoArrayDep = [];
export const newInfoDep = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    newInfoArrayDep = [];

    const newDepartment = req.body['new-department'];
    newInfoArrayDep.push({ 'New Department': `${newDepartment}` });

    const departmentArray = [newDepartment];
    const departmentQuery = 'INSERT INTO departments (name) VALUES ($1) RETURNING *';
    pool.query(departmentQuery, departmentArray).then((departmentResult) => {
      res.redirect('/add-info-new/department');
    });
  }
};

export const newInfoDisplayDep = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    res.render('add-info-new-dep', { newInfoArrayDep });
  }
};

// eslint-disable-next-line prefer-const
export const addApptForm = (req, res) => {
  // eslint-disable-next-line prefer-const
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const formData = [];
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
  }
};

export const addAppt = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    let visitID = 0;
    pool.query('SELECT id FROM patients WHERE name = $1', [req.body['patient-name']]).then((patientResults) => {
      const patientID = patientResults.rows[0].id;
      return pool.query('SELECT id FROM hospitals WHERE name = $1', [req.body.hospital]).then((hospResults) => {
        const hospitalID = hospResults.rows[0].id;
        const hospData = [req.body.date, Number(hospitalID)];
        const hospVisitQuery = 'SELECT * FROM hospital_visits WHERE date = $1 AND hospital_id = $2';
        return pool.query(hospVisitQuery, hospData).then((checkHospRes) => {
          if (checkHospRes.rows.length !== 0) {
            visitID = checkHospRes.rows[0].id;
          }

          if (checkHospRes.rows.length === 0) {
            const visitData = [req.body.date, hospitalID];
            pool.query('INSERT INTO hospital_visits (date, hospital_id) VALUES ($1, $2) RETURNING *', visitData).then((insertResults) => {
              visitID = insertResults.rows[0].id;
            });
          }

          const timeArray = req.body.time;
          const latestTimeArray = [];
          for (let i = 0; i < timeArray.length; i += 1) {
            if (timeArray[i] !== '') {
              latestTimeArray.push(timeArray[i]);
            }
          }
          if (typeof req.body.department === 'object') {
            for (let i = 0; i < req.body.department.length; i += 1) {
            // eslint-disable-next-line no-loop-func
              pool.query('SELECT id FROM departments WHERE name = $1', [req.body.department[i]]).then((departmentResults) => {
                const departmentID = departmentResults.rows[0].id;
                const appointmentData = [visitID, departmentID, latestTimeArray[i], patientID];

                return pool.query('INSERT INTO appointments (visit_id, department_id, time, patient_id) VALUES ($1, $2, $3, $4)', appointmentData).then((apptResults) => {
                  if (i + 1 === req.body.department.length) {
                    res.redirect('/');
                  }
                });
              });
            }
          }
          if ((typeof req.body.department !== 'object')) {
            pool.query('SELECT id FROM departments WHERE name = $1', [req.body.department]).then((departmentResults) => {
              const departmentID = departmentResults.rows[0].id;
              const appointmentData = [visitID, departmentID, latestTimeArray[0], patientID];

              pool.query('INSERT INTO appointments (visit_id, department_id, time, patient_id) VALUES ($1, $2, $3, $4)', appointmentData).then((apptResults) => {
                res.redirect('/');
              });
            });
          }
        });
      });
    });
  }
};

let appointmentID = 0;
let hospitalVisitID = 0;

export const editApptForm = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const stringApptAndHosp = Object.keys(req.query);
    const arrayApptAndHosp = stringApptAndHosp[0].split(',');
    appointmentID = Number(arrayApptAndHosp[0]);
    hospitalVisitID = Number(arrayApptAndHosp[1]);

    const editQuery = 'SELECT patients.name, patients.relationship, hospital_visits.date, hospitals.name AS hospital, departments.name as department, appointments.time FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id WHERE appointments.id = $1';

    return pool.query(editQuery, [appointmentID]).then((editResult) => {
      const editFormInput = editResult.rows[0];
      res.render('edit-appt', { editFormInput });
    });
  }
};

let oldDate = '';
// let oldTime = '';
export const editAppt = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const newTime = req.body.time;
    const newDate = req.body.date;
    pool.query('SELECT date FROM hospital_visits WHERE id = $1', [hospitalVisitID]).then((oldDateResult) => {
      oldDate = oldDateResult.rows[0].date;
      if (oldDate === newDate) {
        pool.query('UPDATE appointments SET time = $1 WHERE id = $2', [newTime, appointmentID]);
        res.redirect('/');
      } else {
      // 2. Check if hosp visit exists: date + hosp id check for hosp_visit id
      // Retrive hospital id;
        pool.query('SELECT hospital_visits.hospital_id, appointments.patient_id, appointments.department_id FROM patients INNER JOIN appointments ON patients.id = appointments.patient_id INNER JOIN hospital_visits ON hospital_visits.id = appointments.visit_id INNER JOIN departments ON appointments.department_id = departments.id INNER JOIN hospitals ON hospital_visits.hospital_id = hospitals.id WHERE appointments.id = $1 AND appointments.visit_id = $2', [appointmentID, hospitalVisitID]).then((hosResult) => {
          const hosID = hosResult.rows[0].hospital_id;
          const patID = hosResult.rows[0].patient_id;
          const departID = hosResult.rows[0].department_id;
          // 1. Delete appt row
          pool.query('DELETE FROM appointments WHERE id = $1', [appointmentID]).then((deletedRequest) => {
            pool.query('SELECT * FROM hospital_visits WHERE date = $1 AND hospital_id = $2', [newDate, hosID]).then((latestResult) => {
            // 2a. if no, create new hosp visit + appt
              if (latestResult.rows.length === 0) {
                pool.query('INSERT INTO hospital_visits (date, hospital_id) VALUES ($1, $2) RETURNING *', [newDate, hosID]).then((newResult) => {
                  const hosVisitID = newResult.rows[0].id;
                  pool.query('INSERT INTO appointments (visit_id, department_id, time, patient_id) VALUES ($1, $2, $3, $4)', [hosVisitID, departID, newTime, patID]).then((results) => {
                    res.redirect('/');
                  });
                });
              }
              // 2b. if use, create new appt with visit_id
              if (latestResult.rows.length !== 0) {
                const visitExistsID = latestResult.rows[0].id;
                pool.query('INSERT INTO appointments (visit_id, department_id, time, patient_id) VALUES ($1, $2, $3, $4)', [visitExistsID, departID, newTime, patID]).then((lastResult) => {
                  res.redirect('/');
                });
              }
            });
          });
        });
      }
    });
  }
};

export const deleteAppt = (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.redirect('/main');
  } else {
    const apptID = Object.keys(req.query)[0];
    pool.query('DELETE FROM appointments WHERE id = $1', [apptID]).then((deleteResult) => {
      res.redirect('/');
    });
  }
};
