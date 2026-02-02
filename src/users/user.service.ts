import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { RequestUserDto } from './dto/request-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async register({ name, email, password }: RequestUserDto): Promise<User> {
    const userExists = await this.usersRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await hash(password, 10);
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return this.usersRepository.save(newUser);
  }
  async findOne(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
