import { Length } from 'class-validator';

export class ResetPasswordDto {
  @Length(6, 100, {
    message: 'La vieja contraseña debe tener al menos 6 caracteres',
  })
  oldPassword: string;

  @Length(6, 100, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres',
  })
  newPassword: string;
}
