import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';
import { EnvConfiguration } from 'src/config/configuration';

export class CloudinaryService {
  constructor(private configService: ConfigService<EnvConfiguration>) {}

  cloudinary(): ConfigOptions {
    return v2.config({
      cloud_name: this.configService.get('CLOUDINARY.CLOUD_NAME', {
        infer: true,
      }),
      api_key: this.configService.get('CLOUDINARY.API_KEY', {
        infer: true,
      }),
      api_secret: this.configService.get('CLOUDINARY.API_SECRET', {
        infer: true,
      }),
    });
  }
}
