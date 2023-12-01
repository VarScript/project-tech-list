import { Injectable } from '@nestjs/common';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';

@Injectable()
export class ListsService {
  create(createListInput: CreateListInput) {
    return 'This action adds a new list';
  }

  findAll() {
    return `This action returns all lists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListInput: UpdateListInput) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
