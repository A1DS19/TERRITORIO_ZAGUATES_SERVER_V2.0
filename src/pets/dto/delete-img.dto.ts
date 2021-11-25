import { IsString } from 'class-validator';

export class DeleteImgDto {
  @IsString()
  petId: string;

  @IsString()
  photoId: string;

  @IsString()
  photoUrl: string;
}
