import { HttpModule, Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { OpenweatherController } from './openweather.controller';
import { OpenweatherService } from './openweather.service';

@Module({
  imports: [HttpModule, DbModule],
  providers: [OpenweatherService],
  controllers: [OpenweatherController],
  exports: [OpenweatherService],
})
export class OpenweatherModule {}
