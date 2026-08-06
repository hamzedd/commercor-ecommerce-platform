import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../src/libs/models/entities/user/User.entity';
import { UserRoleEnum } from '../src/utils/enums/UserEnums';

async function createAdmin(): Promise<void> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity],
    synchronize: false,
  });

  try {
    await dataSource.initialize();

    const userRepository = dataSource.getRepository(UserEntity);

    const existingUser = await userRepository.findOne({
      where: [
        { username: 'admin' },
        { email: 'admin@commercor.local' },
      ],
    });

    if (existingUser) {
      console.log('Admin user already exists.');
      return;
    }

    const passwordHash = await bcrypt.hash('Admin123!', 10);

    const admin = userRepository.create({
      username: 'admin',
      email: 'admin@commercor.local',
      password: passwordHash,
      role: UserRoleEnum.ADMIN,
    });

    await userRepository.save(admin);

    console.log('Admin user created successfully.');
    console.log('Username: admin');
    console.log('Email: admin@commercor.local');
    console.log('Password: Admin123!');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void createAdmin();