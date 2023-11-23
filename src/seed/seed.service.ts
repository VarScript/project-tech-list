import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Item } from '../items/entities/item.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) {
      throw new UnauthorizedException(
        'We cannot run SEED on production',
      );
    }
    // Clean DB

    await this.deleteDataBase();

    // Create Users

    const users = await this.loadUsers();

    // Create Items

    return true;
  }

  async deleteDataBase() {
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }
}
