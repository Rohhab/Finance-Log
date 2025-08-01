import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('User already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const newUser = await this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
