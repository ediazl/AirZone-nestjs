import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenweatherModule } from './openweather/openweather.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [OpenweatherModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
