import { Controller, Get, Query } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';

@Controller('openweather')
export class OpenweatherController {
  constructor(private openweatherService: OpenweatherService) {}

  @Get('clima')
  async getClima(@Query('lat') lat: number, @Query('lon') lon: number) {
    // let { lat, lon } = query;
    if (!lat || !lon) {
      throw new Error();
    }

    return await this.openweatherService.getClimaByCoords(lat, lon);

    /*     console.log(lat, lon);
    res.sendStatus(200); */
  }
}
