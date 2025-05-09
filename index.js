import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { db } from './config/database/databaseConnection.js';
import logger from './logger.js';
import userRoute from './modules/user/user.route.js';
import locationRoute from './modules/location/location.route.js';
configDotenv();
import { errorHandler } from './middleware/errorHandler.js';
import { setUpLogger } from './config/initial/setupLogging.js';
import { setupGracefulShutdown } from './config/initial/shutdown.js';
import { setupSwagger } from './config/initial/swagger.js';
import { populateDatabase } from './utils/populateLocationDatabase.js';

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

app.use(helmet());

populateDatabase();

const corsOpts = {
  origin: '*',
};

app.use(cors(corsOpts));

setUpLogger(logger);
setupSwagger(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1', userRoute);
app.use('/api/v1', locationRoute);
app.use(errorHandler);

const server = app.listen(port, () => {
  db();
  console.log(`Server Started at ${port}`);
});

setupGracefulShutdown(server);
