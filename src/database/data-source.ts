import { RefreshToken } from 'auth/entities/refresh-token.entity';
import { DataSource } from 'typeorm';
import { User } from 'users/entities/user.entity';

export default new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'finance_user',
  password: 'userpass456',
  database: 'finance_log_db',
  entities: [User, RefreshToken],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'finance-log-migrations',
  synchronize: false,
});
