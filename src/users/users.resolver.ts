import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';

import { List } from '../lists/entities/list.entity';
import { User } from './entities/user.entity';
import { Item } from '../items/entities/item.entity';

import {
  PaginationArgs,
  SearchArgs,
} from '../common/dto/args';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { UpdateUserInput } from './dto/update-user.input';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe)
    id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser])
    user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput')
    updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      user,
    );
  }

  @Mutation(() => User, { name: 'blockUser' })
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe)
    id: string,
    @CurrentUser([ValidRoles.admin])
    user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin])
    adminUser: User,
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(
      user,
      paginationArgs,
      searchArgs,
    );
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListsByUser(
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Parent() user: User,
  ): Promise<List[]> {
    return this.listsService.findAll(user);
  }
}
