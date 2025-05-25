import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const [user] = await this.userService.findAll({
      email: registerUserDto.email,
    });

    if (user) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

    return this.userService.create({
      name: registerUserDto.name,
      email: registerUserDto.email,
      password: hashedPassword,
    });
  }

  async login(loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    const [user] = await this.userService.findAll({
      email: loginUserDto.email,
    });

    if (!user) throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) throw new BadRequestException('Invalid Credentials');

    const payload = { id: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
  }
}
