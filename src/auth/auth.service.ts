import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

export type TokenWithUser = {
  token: string;
  user: User;
};
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const validPassword = await argon2.verify(user.password, password);

    if (user && validPassword) {
      return user;
    }

    return null;
  }

  async login(user: User): Promise<TokenWithUser> {
    const payload = {
      id: (user as any)._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user,
    };
  }
}
