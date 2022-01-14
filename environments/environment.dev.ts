import * as path from 'path';
import { EnvironmentDto } from './environment.dto';

// DEV-CARGOTEC Environment
const CURRENT_PATH = `${__dirname}`;
const RIGHT_PATH = path.join(`${CURRENT_PATH}`, '../..');

export const environmentDev: EnvironmentDto = {
  DB_URI: 'mongodb://localhost:27017/Openweather',
  port: 4300,
  hostname: 'localhost',
  swaggerConfig: {
    prefix: 'docs',
    username: 'root',
    password: 'root',
    swaggerDocumentFile: 'swagger.json',
  },
};
