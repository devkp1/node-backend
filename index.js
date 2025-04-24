import express from 'express';
import { configDotenv } from 'dotenv';
import { db } from './config/database/databaseConnection.js';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger/swagger.json');
import logger from './logger.js';
import userRoute from './modules/user/user.route.js';
configDotenv();

const app = express();
const port = 5000;
app.use(express.json());

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);

// swagger config.
const swaggerOptions = {
  swaggerDefinition: swaggerDocument,
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  // console.log(process.env.ENVIRONMENT);
  res.send('Hello World!');
});

app.use('/api/v1', userRoute);

app.listen(port, () => {
  db();
  console.log(`server is running on http://localhost:${port}`);
});
