import pg from 'pg';
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import jsSHA from 'jssha';

const PORT = process.argv[2];

const { Pool } = pg;

let pgConnectionConfigs;
if (process.env.ENV === 'PRODUCTION') {
  pgConnectionConfigs = {
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: '????',
    port: 5432,
  };
} else {
  pgConnectionConfigs = {
    user: 'shannon',
    host: 'localhost',
    database: '???',
    port: 5432,
  };
}

const pool = new Pool(pgConnectionConfigs);

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(cookieParser());

const SALT = process.env.MY_ENV_VAR;

// #################### User Auth
// Hashing function
const getHash = (input) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);
  return shaObj.getHash('HEX');
};

// User Auth function
app.use((req, res, next) => {
  req.isUserLoggedIn = false;

  if (req.cookies.loggedIn && req.cookies.userId) {
    const hash = getHash(req.cookies.userId);
    if (req.cookies.loggedIn === hash) {
      req.isUserLoggedIn = true;
    }
  }
  next();
});

// Signup

// Login

// #################### Routes
app.listen(PORT);
