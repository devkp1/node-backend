import express from 'express';
const userRoute = express.Router();

userRoute.post('/register', (req, res) => {
  res.send('Register route is working.');
});

userRoute.get('/sign-in', (req, res) => {
  res.send('sign-in route is working.');
});

export default userRoute;
