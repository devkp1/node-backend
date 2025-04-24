import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import open from 'open';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const port = process.env.PORT || 5000;

const require = createRequire(import.meta.url);
const swaggerDocument = require('../../swagger/swagger.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tempFilePath = path.join(__dirname, '../swagger.opened.tmp');

const swaggerOptions = {
  swaggerDefinition: swaggerDocument,
  apis: ['./routes/*.js'],
};

export const setupSwagger = (app) => {
  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use('./api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  if (!fs.existsSync(tempFilePath)) {
    open(`http://localhost:${port}/api-docs`);
    fs.writeFileSync(tempFilePath, 'swagger UI opened');
  }
};
