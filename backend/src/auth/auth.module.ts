import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.getOrThrow<string>('JWT_SECRET'),
      signOptions: { expiresIn: config.getOrThrow<StringValue>('JWT_EXPIRES_IN') },
    })
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
