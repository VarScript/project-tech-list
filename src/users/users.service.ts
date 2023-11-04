import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { SignupInput } from '../auth/dto/inputs';
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {
  private logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });

      return await this.usersRepository.save(newUser);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0)
      return this.usersRepository.find();

    return this.usersRepository
      .createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({
        email,
      });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({
        id,
      });
    } catch (error) {
      throw new NotFoundException(
        `User not found, please talk with an admin`,
      );
    }
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

  // ERRORS
  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(
        error.detail.replace('key', ''),
      );
    }

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Please check server logs',
    );
  }
}
