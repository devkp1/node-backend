import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/databaseConnection.js';
dotenv.config();

const app = express();
const port = 5656;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  db();
  console.log(`server is running on http://localhost:${port}`);
});
