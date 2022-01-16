import { HttpModule, Module } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';
import { OpenweatherController } from './openweather.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [HttpModule, DbModule],
  providers: [OpenweatherService],
  controllers: [OpenweatherController],
  exports: [OpenweatherService],
})
export class OpenweatherModule {}
