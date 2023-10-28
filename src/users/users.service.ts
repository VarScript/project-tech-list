import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { SignupInput } from '../auth/dto/inputs/signup-input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser =
        this.usersRepository.create(signupInput);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log({error});
      
      throw new BadRequestException('Something went bad');
    }
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  findOne(id: string): Promise<User> {
    throw new NotFoundException(
      `The findOne method not implemented `,
    );
  }

  // update(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  block(id: string): Promise<User> {
    throw new NotFoundException(
      `The block method not implemented `,
    );
  }

  // remove(id: string): Promise<User> {
  //   throw new NotFoundException(`The remove method not implemented `);
  // }
}
