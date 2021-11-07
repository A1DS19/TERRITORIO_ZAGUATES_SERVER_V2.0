import { IsEmail, Length } from 'class-validator';

export class ValidateUserDTO {
  @IsEmail({}, { message: 'Debe agregar un email valido' })
  email: string;

  @Length(6, 100, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
