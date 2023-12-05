import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import {
  PaginationArgs,
  SearchArgs,
} from '../common/dto/args';

import { List } from '../lists/entities/list.entity';
import { ListItem } from './entities/list-item.entity';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(
    createListItemInput: CreateListItemInput,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const newListItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    return this.listItemRepository.save(newListItem);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBilder = this.listItemRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

    if (search) {
      queryBilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBilder.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} listItem`;
  }

  update(
    id: number,
    updateListItemInput: UpdateListItemInput,
  ) {
    return `This action updates a #${id} listItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }
}
