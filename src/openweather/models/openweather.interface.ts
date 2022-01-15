import { Document } from 'mongodb';

export interface IClima extends Document {
  lat: number;
  lon: number;
  updatedAt: Date;
  data: {
    hourly: object[];
    daily: object[];
  };
}
