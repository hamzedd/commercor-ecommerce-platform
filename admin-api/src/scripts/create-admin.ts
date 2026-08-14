import dataSource from '@/src/utils/migrationDataSource';
import { UserEntity } from '@/src/libs/models/entities/user/User.entity';
import { UserRoleEnum } from '@/src/utils/enums/UserEnums';
import { hashString } from '@/src/utils/functions/hashFunctions';

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function strongPassword(password: string) {
  return (
    password.length >= 12 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

async function main() {
  const username = required('ADMIN_BOOTSTRAP_USERNAME');
  const email = required('ADMIN_BOOTSTRAP_EMAIL').toLowerCase();
  const password = required('ADMIN_BOOTSTRAP_PASSWORD');
  if (!/^\S+@\S+\.\S+$/.test(email))
    throw new Error('ADMIN_BOOTSTRAP_EMAIL must be valid');
  if (!strongPassword(password))
    throw new Error(
      'ADMIN_BOOTSTRAP_PASSWORD must be at least 12 characters and include upper, lower, number, and symbol',
    );
  await dataSource.initialize();
  try {
    const repository = dataSource.getRepository(UserEntity);
    if (
      await repository
        .createQueryBuilder('user')
        .where('LOWER(user.username) = LOWER(:username)', { username })
        .orWhere('LOWER(user.email) = LOWER(:email)', { email })
        .getOne()
    )
      throw new Error(
        'An administrator with this username or email already exists',
      );
    await repository.save(
      repository.create({
        username,
        email,
        password: await hashString(password),
        role: UserRoleEnum.ADMIN,
      }),
    );
    process.stdout.write(`Administrator created for ${email}\n`);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
});
