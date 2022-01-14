import { environmentDev } from 'environments/environment.dev';
import { EnvironmentDto } from 'environments/environment.dto';

// tslint:disable:no-hardcoded-credentials
const NODE_ENV = process.env.NODE_ENV;
let environment: EnvironmentDto;

if (NODE_ENV === 'DEV') {
  console.log('ENVIRONMENT IS: ' + NODE_ENV);
  environment = environmentDev;
} else {
  environment = environmentDev;
  throw new Error('Environment desconocido');
}

export default environment;
