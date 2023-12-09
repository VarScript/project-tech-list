import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    await this.listItemRepository.save(newListItem);

    return this.findOne(newListItem.id);
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

  async findOne(id: string): Promise<ListItem> {
    const listItem =
      await this.listItemRepository.findOneBy({ id });

    if (!listItem)
      throw new NotFoundException(
        `List Item with id: ${id} not found`,
      );

    return listItem;
  }

  async update(
    id: string,
    updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    const { itemId, listId, ...rest } = updateListItemInput;

    const queryBilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId) queryBilder.set({ list: { id: listId } });
    if (itemId) queryBilder.set({ item: { id: listId } });

    queryBilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async listItemCountByList(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: {
        list: {
          id: list.id,
        },
      },
    });
  }
}
