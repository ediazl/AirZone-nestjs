import { ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import environment from 'environment';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Openweather-nestjs')
  .setDescription('API description')
  .setVersion('0.1')
  .build();
const document = SwaggerModule.createDocument(app, options);

SwaggerModule.setup('swagger', app, document);
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
