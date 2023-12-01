import { Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { User } from 'src/users/entities/user.entity';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findAll() {
    return `This action returns all lists`;
  }

  findOne(id: string) {
    return `This action returns a #${id} list`;
  }

  update(id: string, updateListInput: UpdateListInput) {
    return `This action updates a #${id} list`;
  }

  remove(id: string) {
    return `This action removes a #${id} list`;
  }
}
