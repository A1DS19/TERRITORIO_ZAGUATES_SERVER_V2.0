import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvConfiguration } from 'src/config/configuration';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

export type ValidToken = {
  id: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<EnvConfiguration>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET_KEY', {
        infer: true,
      }),
    });
  }

  async validate(payload: ValidToken): Promise<User> {
    const { id } = payload;
    const user = await this.usersService.findById(id);
    return user;
  }
}
