import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenweatherService } from './openweather.service';

@Controller('openweather')
@ApiTags('openweather')
export class OpenweatherController {
  constructor(private openweatherService: OpenweatherService) {}

  @Get('clima')
  @ApiOperation({summary: 'Returns weather given lat and long '})
  async getClima(@Query('lat') lat: number, @Query('lon') lon: number) {
    if (!lat || !lon) {
      throw new BadRequestException('Check that is supplied lat and lon');
    }

    let res = await this.openweatherService.getClimaByCoords(lat, lon);
    delete res['_id'];
    return res;
  }

  @Get('clima/hour')
  @ApiOperation({summary: 'Returns weather given lat, long and future hour.'})
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

    let res = await this.openweatherService.getClimaByCoordsHour(lat, lon, hour);
    delete res['_id']
    return res;
  }
}
