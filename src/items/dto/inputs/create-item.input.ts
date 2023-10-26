import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Float)
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @Field(() => Float)
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
