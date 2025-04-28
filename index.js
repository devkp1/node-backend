import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import { db } from './config/database/databaseConnection.js';
import logger from './logger.js';
import userRoute from './modules/user/user.route.js';
configDotenv();
import { setupLogging } from './config/initial/setupLogging.js';
import { setupGracefulShutdown } from './config/initial/shutdown.js';
import { setupSwagger } from './config/initial/swagger.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use(cors());

setupLogging(logger);
setupSwagger(app);

app.get('/', (req, res) => {
  // console.log(process.env.ENVIRONMENT);
  res.send('Hello World!');
});

app.use('/api/v1', userRoute);

const server = app.listen(port, () => {
  db();
});

setupGracefulShutdown(server);
