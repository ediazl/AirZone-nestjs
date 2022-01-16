import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from '../db/db.module';
import * as request from 'supertest';
import { OpenweatherController } from './openweather.controller';
import { OpenweatherService } from './openweather.service';
import { OpenweatherModule } from './openweather.module';

describe('OpenweatherController', () => {
  let app: INestApplication;

  const mockDataClima = [ 
    {
      lat: 41.8,
      lon: -0.8,
      timezone: "Europe/Madrid",
      timezone_offset: 3600,
      updatedAt: {
          "$date": "2022-01-16T18:06:03.085Z"
      },
    }
  ];

  const mockDataClimaHour = [ 
    {
      lat: 41.8,
      lon: -0.8,
      timezone: "Europe/Madrid",
      timezone_offset: 3600,
      updatedAt: {
          "$date": "2022-01-16T18:06:03.085Z"
      },
    }
  ];
  const mockClimaRepository = {
    find: jest.fn().mockImplementation(() => Promise.resolve(mockDataClima)), 
};
  
  beforeEach(async () => {
    const test: TestingModule = await Test.createTestingModule({
      controllers: [OpenweatherController],
      providers: [OpenweatherService]
    }).overrideProvider(OpenweatherService).useValue(mockClimaRepository)
      .compile();

    app = test.createNestApplication();
    await app.init();

   /*  controller = module.get<OpenweatherController>(OpenweatherController);
    service = module.get<OpenweatherService>(OpenweatherService); */
  });

  it('/GET openweather/clima', async () => {
    const lat = 41.8, lon = -0.8;
    // Call to service request method to get data. 
    return request(app.getHttpServer())
      .get(`/openweather/clima?lat=${lat}&lon=${lon}` )
      .expect(200)
      .expect(mockDataClima); 
  });

  it('/GET openweather/clima/hour', async () => {
    const lat = 41.8, lon = -0.8, hour=13
    // Call to service request method to get data. 
    return request(app.getHttpServer())
      .get(`/openweather/clima/hour?lat=${lat}&lon=${lon}&hour=13` )
      .expect(200)
      .expect(mockDataClimaHour); 
  });


  afterAll(async () => { 
    await app.close();
  });
});
