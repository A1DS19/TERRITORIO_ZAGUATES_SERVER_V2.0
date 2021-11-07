import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { AuthService, TokenWithUser } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req): Promise<TokenWithUser> {
    return await this.authService.login(req.user as User);
  }

  @Post('/register')
  async register(@Body() body: RegisterDto): Promise<TokenWithUser> {
    const user = await this.usersService.create(body);
    return await this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(@Request() req): Promise<User> {
    return req.user;
  }
}
