import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';

import {
  CreateItemInput,
  UpdateItemInput,
} from './dto/inputs';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(
    private readonly itemsService: ItemsService,
  ) {}

  @Mutation(() => Item, {name: 'createInput'})
  async createItem(
    @CurrentUser() user: User,
    @Args('createItemInput')
    createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe)
    id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput')
    updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(
      updateItemInput.id,
      updateItemInput,
    );
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID })
    id: string,
    @CurrentUser() user: User
  ) {
    return this.itemsService.remove(id, user);
  }
}
