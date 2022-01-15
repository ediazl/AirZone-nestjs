import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { OpenweatherService } from './openweather.service';

@Controller('openweather')
export class OpenweatherController {
  constructor(private openweatherService: OpenweatherService) {}

  @Get('clima')
  async getClima(@Query('lat') lat: number, @Query('lon') lon: number) {
    // let { lat, lon } = query;
    if (!lat || !lon) {
      throw new BadRequestException('Check that is supplied lat and lon');
    }

    return await this.openweatherService.getClimaByCoords(lat, lon);

    /*     console.log(lat, lon);
    res.sendStatus(200); */
  }

  @Get('clima/hour')
  async getClimaInHour(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('hour') hour: number,
  ) {
    // let { lat, lon } = query;
    if (!lat || !lon || !hour) {
      throw new BadRequestException('Check that is supplied lat, lon and hour');
    }
    if (hour < 0 || hour > 23) {
      throw new BadRequestException('Check hour values');
    }

    return await this.openweatherService.getClimaByCoordsHour(lat, lon, hour);

    /*     console.log(lat, lon);
    res.sendStatus(200); */
  }
}
