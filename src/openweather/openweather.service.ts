import {
  ConflictException,
  HttpService,
  Inject,
  Injectable,
} from '@nestjs/common';
import environment from 'environment';
import { Db } from 'mongodb';
import { HOURS_THRESHOLD, OPENWEATHER_ONECALL_URI } from './contants';
import { IClima } from './models/openweather.interface';

@Injectable()
export class OpenweatherService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
    private httpService: HttpService,
  ) {}

  /**
   * @param lat
   * @param lon
   * @returns weather given coords. If weather is outdated, update it in DB
   */
  async getClimaByCoords(lat: number, lon: number) {
    // Get lat and long from response object to inser in DB -> avoid too much decimals
    lat = +lat.toFixed(2);
    lon = +lon.toFixed(2);

    console.log(lat, lon);
    let clima = await this.db
      .collection<IClima>('AirZone')
      .findOne({ lat: lat, lon: lon });

    // Dont have this record in DB
    if (!clima) {
      console.log('Not in DB');
      let res = await this.climaRequestByCoords(lat, lon);
      console.log(res.lat, res.lon);
      let newClima: IClima = {
        lat: res.lat,
        lon: res.lon,
        updatedAt: new Date(),
        data: { daily: res.daily, hourly: res.hourly },
      };

      await this.db.collection<IClima>('AirZone').insertOne(newClima);
      return newClima.data;
    } else {
      console.log('In DB already');

      // We have this record in DB
      if (this.isOutdated(clima)) {
        console.log('Clima outdated');

        // Get weather new data
        let res = await this.climaRequestByCoords(lat, lon);
        let newClima: IClima = {
          lat: res.lat,
          lon: res.lon,
          updatedAt: new Date(),
          data: { daily: res.daily, hourly: res.hourly },
        };

        // Update document with new data
        await this.db
          .collection<IClima>('AirZone')
          .updateOne(
            { lat: res.lat, lon: res.lon },
            { $set: { updatedAt: new Date(), data: newClima.data } },
          );
        return newClima.data;
      } else {
        console.log('Clima date OK');

        return clima.data;
      }
    }
  }

  /**
   * This function makes http request
   * @param lat
   * @param lon
   * @returns weather data given coordinates
   */
  private async climaRequestByCoords(lat: number, lon: number) {
    try {
      let res = await this.httpService
        .get(
          `${OPENWEATHER_ONECALL_URI}?lat=${lat}&lon=${lon}&appid=${environment.API_KEY}`,
        )
        .toPromise();
      // console.log(res.data);
      return res.data;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  /**
   * Returns true if date is outdated. +3 hours
   * @param clima
   */
  private isOutdated(clima: IClima) {
    let diff = (new Date().getTime() - clima.updatedAt.getTime()) / 3600000; // to hours
    return diff > HOURS_THRESHOLD;
  }
}
