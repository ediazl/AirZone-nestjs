import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import environment from 'environment';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validación de tipos en controladores

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();

  await app.listen(environment.port).then(() => {
    console.log(
      ` Swagger docs available on: http:/${environment.hostname}:${environment.port}/swagger`,
    );
    console.log(` Server started at: ${new Date()}`);
  });
}
bootstrap();
