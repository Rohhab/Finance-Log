import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'Pouria@finance-log.com',
      password: 'A@123456',
    },
    {
      userId: 2,
      username: 'Reza@finance-log.com',
      password: 'B@123456',
    },
    {
      userId: 3,
      username: 'Saeid@finance-log.com',
      password: 'C@123456',
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }
}
