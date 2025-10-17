import { User } from 'iam/users/entities/user.entity';
import { RefreshToken } from 'iam/auth/entities/refresh-token.entity';
import { BankAccount } from 'financial/bank-accounts/entities/bank-account.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'finance_user',
  password: 'userpass456',
  database: 'finance_log_db',
  entities: [User, RefreshToken, BankAccount],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'finance_log_migrations',
  synchronize: false,
});
