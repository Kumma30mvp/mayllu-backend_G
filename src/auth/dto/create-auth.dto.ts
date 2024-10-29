import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'El DNI no puede estar vacío' })
  @Matches(/^\d{8}$/, { message: 'El DNI debe tener exactamente 8 dígitos' }) // Si el DNI en tu país tiene un formato específico, por ejemplo, 8 dígitos
  dni: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
}
