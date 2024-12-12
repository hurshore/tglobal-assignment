import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field(() => Int)
  id: number;

  @Field()
  @IsNotEmpty()
  @MinLength(2, { message: 'Department name must be at least 2 characters long' })
  name: string;
}
