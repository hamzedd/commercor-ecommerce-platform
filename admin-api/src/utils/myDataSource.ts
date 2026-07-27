import { DataSource } from 'typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from '@/src/utils/environmentConstants';

export async function myDataSource() {
  return new DataSource({
    type: DB_TYPE as any,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    entities: [
      'dist/libs/models/entities/*.entity.{js,ts}',
      'dist/libs/models/entities/*/*.entity.{js,ts}',
    ],
  });
}
