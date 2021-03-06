import { Module } from '@nestjs/common';
import environment from 'environment';
import { Db, MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        try {
          const client = await MongoClient.connect(
            `${environment.DB_URI}`,
          );
          console.log('Connected to DB');
          return client.db('Openweather-nestjs');

        } catch (e) {
          console.error('Cannot connect to DB');
          throw e;
        }
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DbModule {}
