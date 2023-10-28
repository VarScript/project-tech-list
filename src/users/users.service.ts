import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

import { SignupInput } from '../auth/dto/inputs/signup-input';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

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
      this.handleDBError(error);
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

  private handleDBError(error: any): never {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new BadRequestException(
        error.detail.replace('key', ''),
      );
    }

    throw new InternalServerErrorException(
      'Please check server logs',
    );
  }
}
