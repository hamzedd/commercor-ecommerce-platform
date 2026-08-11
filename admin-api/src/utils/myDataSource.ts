import { DataSource } from 'typeorm';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from '@/src/utils/environmentConstants';

export const AppDataSource = new DataSource({
  type: DB_TYPE as any,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    __dirname + '/../libs/models/entities/*.entity.{js,ts}',
    __dirname + '/../libs/models/entities/*/*.entity.{js,ts}',
  ],
  migrations: [__dirname + '/../migrations/*.{js,ts}'],
  synchronize: false,
});

export function myDataSource() {
  return AppDataSource;
}

export default AppDataSource;
