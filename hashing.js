import jsSHA from 'jssha';

// SALT
const SALT = process.env.MY_ENV_VAR;

// Hashing function
export const getHash = (input) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedString = `${input}-${SALT}`;
  shaObj.update(unhashedString);
  return shaObj.getHash('HEX');
};

// User authentication
export const userAuth = (req, res, next) => {
  req.isUserLoggedIn = false;

  if (req.cookies.loggedInHash && req.cookies.userId) {
    const hash = getHash(req.cookies.userId);
    if (req.cookies.loggedInHash === hash) {
      req.isUserLoggedIn = true;
    }
  }
  console.log(req.isUserLoggedIn);
  next();
};
