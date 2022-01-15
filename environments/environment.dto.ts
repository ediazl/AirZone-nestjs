export interface EnvironmentDto {
  DB_URI: string;
  API_KEY: string;
  port: number;
  hostname: string;
  swaggerConfig: {
    prefix: string;
    username: string;
    password: string;
    swaggerDocumentFile: string;
  };
}
