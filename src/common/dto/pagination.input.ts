import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
