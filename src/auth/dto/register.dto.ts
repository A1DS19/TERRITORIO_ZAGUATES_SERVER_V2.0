import { IsEmail, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Debe agregar un email valido' })
  email: string;

  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @MinLength(9, { message: 'Debe agregar una cedula correcta' })
  cedula: string;

  @MinLength(1, { message: 'Debe agregar su nombre de usuario' })
  displayName: string;
}
