import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupGracefulShutdown = (server) => {
  const tempFilePath = path.join(__dirname, '../swagger_opened.tmp');

  process.on('SIGINT', () => {
    server.close(() => {
      fs.removeSync(tempFilePath);
      process.exit();
    });
  });
};
