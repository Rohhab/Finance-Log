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

  signUp() {
    // get user email and password from the controller when signing in
    // check if it's already in the DB
    // if not, create the new record in the DB
  }

  signIn() {
    // get user email and password from the controller
    // check if it's alrady in the DB
    // check the correctness of the password
    // IDK what to do from this point :]
    // maybe we need to generate a token and keep it alive for a while
    // to show the user is signed-in.
  }
}
