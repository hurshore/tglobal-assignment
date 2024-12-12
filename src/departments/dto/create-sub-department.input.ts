import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateSubDepartmentInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2, { message: 'Sub-department name must be at least 2 characters long' })
  name: string;
}
