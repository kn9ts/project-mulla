import dotenv from 'dotenv';

if ((process.env.NODE_ENV || 'development') === 'development') {
  // load the applications environment
  dotenv.load();
}
