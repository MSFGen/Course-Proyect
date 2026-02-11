import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketModule } from './ticket/ticket.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true}),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true ,
    synchronize: true, // ❗ solo dev
  }),
  AuthModule,
  UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
