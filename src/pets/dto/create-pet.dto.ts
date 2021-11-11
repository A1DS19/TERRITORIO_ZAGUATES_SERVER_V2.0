import { IsString, ValidationArguments } from 'class-validator';

export class CreatePetDto {
  @IsString({ message: 'Debe agregar el nombre de la mascota' })
  name: string;

  @IsString({ message: 'Debe agregar la ubicacion de la mascota' })
  location: string;

  @IsString({ message: 'Debe agregar la raza de la mascota' })
  breed: string;

  @IsString({
    message: (args: ValidationArguments) => {
      if (args.value !== 'true' || args.value !== 'false') {
        return 'Debe agregar si la mascota esta adoptada';
      }
    },
  })
  adopted: string;

  @IsString({
    message: (args: ValidationArguments) => {
      if (args.value !== 'pequeño' || args.value !== 'grande') {
        return 'Debe agregar el tamaño de la mascota';
      }
    },
  })
  size: string;

  @IsString({ message: 'Debe agregar la decripccion de la mascota' })
  description: string;
}
