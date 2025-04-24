import express from 'express';
import fs from 'fs-extra';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
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
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const tempFilePath = path.join(__dirname, 'swagger_opened.tmp');

  const server = app.listen(port, () => {
    db();

    if (!fs.existsSync(tempFilePath)) {
      open(`http://localhost:${port}/api-docs`);
      fs.writeFileSync(tempFilePath, 'Swagger UI opened');
    }
  });

  process.on('SIGINT', () => {
    server.close(() => {
      fs.removeSync(tempFilePath);
      process.exit();
    });
  });
});
