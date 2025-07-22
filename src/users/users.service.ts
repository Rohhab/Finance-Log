import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: string[] = ['Pouria', 'Reza', 'Ghalandar'];

  getAllUsers() {
    return this.users;
  }

  getUser(id: number) {
    if (!this.users[id]) {
      return 'The user is not defined';
    }
    return this.users[id];
  }
}
