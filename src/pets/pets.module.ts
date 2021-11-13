import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './entities/pet.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesService } from './files/files.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { EnvConfiguration } from 'src/config/configuration';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    UsersModule,
    ConfigModule,
  ],
  controllers: [PetsController],
  providers: [
    PetsService,
    FilesService,
    {
      provide: 'Cloudinary',
      useFactory: (config: ConfigService<EnvConfiguration>) => {
        return v2.config({
          cloud_name: config.get('CLOUDINARY.CLOUD_NAME', {
            infer: true,
          }),
          api_key: config.get('CLOUDINARY.API_KEY', {
            infer: true,
          }),
          api_secret: config.get('CLOUDINARY.API_SECRET', {
            infer: true,
          }),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class PetsModule {}
