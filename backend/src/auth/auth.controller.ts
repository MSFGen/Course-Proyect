import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto} from './dto/auth.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('api-key')
@UseGuards(ApiKeyGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

}