import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';

import { User } from '../users/entities/user.entity';
import { List } from './entities/list.entity';

import { ListsService } from './lists.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
  ) {}

  @Mutation(() => List, { name: 'createList' })
  async createList(
    @CurrentUser() user: User,
    @Args('createListInput')
    createListInput: CreateListInput,
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: 'lists' })
  findAll() {
    return this.listsService.findAll();
  }

  @Query(() => List, { name: 'list' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.listsService.findOne(id);
  }

  @Mutation(() => List)
  updateList(
    @Args('updateListInput')
    updateListInput: UpdateListInput,
  ) {
    return this.listsService.update(
      updateListInput.id,
      updateListInput,
    );
  }

  @Mutation(() => List)
  removeList(@Args('id', { type: () => Int }) id: string) {
    return this.listsService.remove(id);
  }
}
