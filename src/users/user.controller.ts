import { Body, Controller, Post } from '@nestjs/common';
import { RequestUserDto } from './dto/request-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  async register(@Body() requestUserDto: RequestUserDto) {
    return this.usersService.register(requestUserDto);
  }
}
