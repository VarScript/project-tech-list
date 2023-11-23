import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  constructor() {}

  async executeSeed(): Promise<boolean> {
    // Clean DB

    // Create Users

    // Create Items

    return true;
  }
}
