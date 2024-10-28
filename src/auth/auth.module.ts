import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { UsersController } from 'src/users/users.controller';
import { Repository } from 'typeorm';
import { AppModule } from 'src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../model/user.entity'; // Importa la entidad User
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    User,
    JwtModule.register({
      secret: '123', // Cambia esto por un secreto más seguro, preferentemente almacenado en variables de entorno
      signOptions: { expiresIn: '30d' }, // Define el tiempo de expiración del token (ej. 60 segundos)
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
