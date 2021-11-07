import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MinLength,
  ValidationArguments,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe agregar un email valido' })
  email: string;

  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @MinLength(1, { message: 'Debe agregar su nombre' })
  name: string;

  @MinLength(1, { message: 'Debe agregar su apellido' })
  lastName: string;

  @IsOptional()
  @IsString({
    message: (args: ValidationArguments) => {
      if (args.value !== 'true' || args.value !== 'false') {
        return 'Valor de dato incorrecto';
      }
    },
  })
  isAdmin: string;

  @MinLength(9, { message: 'Debe agregar una cedula correcta' })
  cedula: string;

  @MinLength(1, { message: 'Debe agregar su nombre de usuario' })
  displayName: string;
}
