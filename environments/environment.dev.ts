import * as path from 'path';
import { EnvironmentDto } from './environment.dto';

// DEV-CARGOTEC Environment
const CURRENT_PATH = `${__dirname}`;
const RIGHT_PATH = path.join(`${CURRENT_PATH}`, '../..');

export const environmentDev: EnvironmentDto = {
  DB_URI: 'mongodb://db:27017',
  API_KEY: '58fe0c7b76b9fd6b0e5005c85ec22ac6',
  port: 3001,
  hostname: 'localhost',
};
