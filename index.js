import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { userAuth } from './hashing.js';
import {
  signUpForm, signUpFormResults, loginForm, loginFormResults, logout,
} from './account-routes-callbacks.js';

const PORT = process.argv[2];

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(cookieParser());

// User Authenticaiton
app.use(userAuth);

// Signup
app.get('/signup', signUpForm);
app.post('/signup', signUpFormResults);

// Login
app.get('/login', loginForm);

app.post('/login', loginFormResults);

// Logout
app.delete('/logout', logout);

// #################### Routes
app.listen(PORT);
