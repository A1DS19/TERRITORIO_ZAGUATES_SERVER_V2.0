import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { v2 } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Model } from 'mongoose';
import { EnvConfiguration } from 'src/config/configuration';
import { Pet, PetDocument } from '../entities/pet.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(Pet.name) private petModel: Model<PetDocument>,
    private configService: ConfigService<EnvConfiguration>,
  ) {}

  //maybe agregar nuevo espacio en db que incluya el public_id y url de cada imagen para borrarla

  async uploadFiles(
    files: Array<Express.Multer.File>,
    petId: string,
  ): Promise<Pet> {
    const pet = await this.petModel.findById(petId);

    return new Promise((resolve, reject) => {
      files.forEach((file) => {
        const stream = v2.uploader.upload_stream(
          { folder: `pets/${pet.name}` },
          async (error, result) => {
            if (result) {
              pet.photosUrl.push(result.secure_url);
              pet.photosPublicId.push(result.public_id);
              await pet.save();
              resolve(pet);
            } else {
              console.log(error);
              reject(error);
            }
          },
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });
  }

  async deleteFiles(petId: string): Promise<boolean> {
    const pet = await this.petModel.findById(petId);
    const res = await v2.api.delete_resources(pet.photosPublicId);

    if (res) {
      pet.photosPublicId = [];
      pet.photosUrl = [];
      await pet.save();
      return true;
    } else {
      return false;
    }
  }
}
