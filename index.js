import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { sessionAuth } from './hashing.js';
import {
  signUpForm, signUpFormResults, loginForm, loginFormResults, logout,
} from './account-route-callbacks.js';
import {
  // eslint-disable-next-line max-len
  mainPage, homePage, newInfoForm, newInfo, newInfoDisplay, addApptForm, addAppt, editApptForm, editAppt, deleteAppt,
} from './route-callbacks.js';

const PORT = process.argv[2];

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(cookieParser());
// Session Authenticaiton
app.use(sessionAuth);

// #################### Account Routes
// Signup
app.get('/signup', signUpForm);
app.post('/signup', signUpFormResults);
// Login
app.get('/login', loginForm);
app.post('/login', loginFormResults);
// Logout
app.delete('/logout', logout);

// #################### Routes
app.get('/main', mainPage);
app.get('/', homePage);
app.get('/add-info', newInfoForm);
app.post('/add-info', newInfo);
app.get('/add-info-new', newInfoDisplay);
app.get('/add-appt', addApptForm);
app.post('/add-appt', addAppt);
app.get('/edit-appt', editApptForm);
app.put('/edit-appt', editAppt);
app.get('/delete-appt', deleteAppt);
app.listen(PORT);
