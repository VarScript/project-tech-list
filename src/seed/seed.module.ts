import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [TypeOrmModule]
})
export class SeedModule {}
