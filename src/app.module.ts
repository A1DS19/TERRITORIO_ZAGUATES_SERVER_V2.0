import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration, env_config } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [env_config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService<EnvConfiguration>) => ({
        uri: config.get('DATABASE.MONGO_URI', { infer: true }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
