import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { comparePassword } from 'src/common/utils/bycriptHas';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async login(authDto: AuthDto) {
        const user = await this.userRepository.findOne({where: {email: authDto.email}});
        if (!user) return 'Invalid User';
        const passwordMatch = await comparePassword(authDto.password, user.password);
        if (!passwordMatch) return 'Invalid User';
        const payload = {
            id: user.id,
        };
        return {accesToken: this.jwtService.sign(payload) };
    }
}
