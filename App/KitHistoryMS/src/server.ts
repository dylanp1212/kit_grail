import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3016, () => {
  console.log('Server Running on port 3016');
  console.log('API Testing UI: http://localhost:3016/api/v0/docs/');
});
