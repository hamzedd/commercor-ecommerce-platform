import { DataSource } from 'typeorm';
import 'dotenv/config';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_TYPE,
  DB_USERNAME,
} from '@/src/utils/environmentConstants';

const dataSource = new DataSource({
  type: DB_TYPE as any,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [
    'src/libs/models/entities/*.entity.ts',
    'src/libs/models/entities/*/*.entity.ts',
  ],
  migrations: ['src/migrations/*.ts'],
});

export default dataSource;
