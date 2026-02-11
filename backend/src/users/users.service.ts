import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/common/utils/bycriptHas';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest} = createUserDto;
    const user = await this.findOne(createUserDto.email);
    if (user === 'User not found') {
      const newUser = this.userRepository.create({...rest, password:await hashPassword(password)});
      await this.userRepository.save(newUser);
      const { password: _, createdAt, updatedAt, ...userWithoutSensitive } = newUser;
    return userWithoutSensitive;;
    } else {
      return 'User already exists';
    }
  }

  async findAll() {
    const users = await this.userRepository.find({});
    return users.map(({ password, createdAt, updatedAt, ...userWithoutSensitive }) => userWithoutSensitive);
  }

  async findOne(email: string) {
    const user = await this.userRepository.findOne({where: {email: email}});
    if (!user) {
      return 'User not found';
    }
    const { password, createdAt, updatedAt, ...userWithoutSensitive } = user;
    return userWithoutSensitive ;
  }

 async update(id: string, updateUserDto: UpdateUserDto) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) return 'User not found';
  await this.userRepository.update(id, updateUserDto);
  const userUpdate = await this.userRepository.findOne({ where: { id } });
  if (!userUpdate) return 'User not found';
  const { password, createdAt, updatedAt, ...userWithoutSensitive } = userUpdate;
  return userWithoutSensitive;
}

  async remove(id: string) {
    const user = await this.userRepository.findOne({where: {id: id}});
    if (!user) return 'User not found';
    await this.userRepository.delete(id);
    return 'executed';
  }
}
