import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ID } from '@nestjs/graphql';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(
    createListInput: CreateListInput,
    user: User,
  ): Promise<List> {
    const newList = this.listRepository.create({
      ...createListInput,
      user,
    });
    return await this.listRepository.save(newList);
  }

  async findAll(user: User): Promise<List[]> {
    return await this.listRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!list) {
      throw new NotFoundException(
        `The list with id: ${id} not found`,
      );
    }
    return list;
  }

  update(id: string, updateListInput: UpdateListInput) {
    return `This action updates a #${id} list`;
  }

  remove(id: string) {
    return `This action removes a #${id} list`;
  }
}
