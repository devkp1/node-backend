import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
  res.send('Register route is working.');
});

router.get('/sending', (req, res) => res.send('This is sending...'));

export { router };
