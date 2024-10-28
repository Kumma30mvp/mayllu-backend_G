import { IsNotEmpty, IsString, IsNumber, IsLatitude, IsLongitude, IsDateString } from 'class-validator';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // Usando coordenadas separadas para latitud y longitud
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsDateString()
  created_at: Date | string;

  @IsNotEmpty()
  @IsDateString()
  updated_at: Date | string;
}
