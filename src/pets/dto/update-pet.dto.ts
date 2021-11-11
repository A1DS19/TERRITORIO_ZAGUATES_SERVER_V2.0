import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreatePetDto } from './create-pet.dto';

export class UpdatePetDto extends PartialType(CreatePetDto) {
  @IsOptional()
  adopteeId: string;
}
