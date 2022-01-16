import { Document } from 'mongodb';

export interface IClima extends Document {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  updatedAt: Date;

    hourly: object[];
    daily: object[];
}
