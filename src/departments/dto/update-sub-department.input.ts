import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class UpdateSubDepartmentInput {
  @Field(() => Int)
  id: number;

  @Field()
  @IsNotEmpty()
  @MinLength(2, { message: 'Sub-department name must be at least 2 characters long' })
  name: string;
}
