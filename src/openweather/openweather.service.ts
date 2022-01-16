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
  async getClimaByCoords(lat: number, lon: number): Promise<IClima> {
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
        timezone: res.timezone,
        timezone_offset: res.timezone_offset,
        updatedAt: new Date(),
        daily: res.daily,
        hourly: res.hourly
      };

      await this.db.collection<IClima>('AirZone').insertOne(newClima);
      return newClima;
    } else {
      console.log('In DB already');

      // We have this record in DB
      if (this.isOutdated(clima)) {
        console.log('Clima outdated');

        // Get weather new data
        let res = await this.climaRequestByCoords(lat, lon);

        // Update document with new data
        await this.db
          .collection<IClima>('AirZone')
          .updateOne(
            { lat: res.lat, lon: res.lon },
            { $set: { updatedAt: new Date(), daily: res.daily, hourly: res.hourly}} 
          );
        return res;
      } else {
        console.log('Clima date OK');
        return clima;
      }
    }
    
  }

  /**
   *
   * @param lat
   * @param lon
   * @param hour
   * @returns weather data for lat lon and next hour especified. i.e: now 14:00, request 13. returns 13 hour of tomorrow
   */
  async getClimaByCoordsHour(lat: number, lon: number, hour: number) {
    lat = +lat.toFixed(2);
    lon = +lon.toFixed(2);

    // TODO: Comprobar si hoy se ha pedido fecha para lat y lon
    let res = await this.getClimaByCoords(lat, lon);

    // console.log(res);

    // TODO: Si se ha pedido, devolver entrada daily de hour. Si no, hacer peticion getClima y devolver entrada daily de hour

    let hourRes = res.hourly.filter((entry: any) => {
      // UNIX timestamp to ms
      console.log(new Date((entry.dt + res.timezone_offset) * 1000).getHours());

      return (
        new Date((entry.dt + res.timezone_offset) * 1000).getHours() == hour
      );
    });
    console.log(hourRes);
    return hourRes[0];
  }

  /**
   * This function makes http request
   * @param lat
   * @param lon
   * @returns weather data given coordinates
   */
  async climaRequestByCoords(lat: number, lon: number) {
    try {
      let res = await this.httpService
        .get(
          `${OPENWEATHER_ONECALL_URI}?lat=${lat}&lon=${lon}&exclude={current,minutely,alerts}&appid=${environment.API_KEY}`,
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
