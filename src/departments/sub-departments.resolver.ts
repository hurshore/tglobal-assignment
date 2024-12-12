import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SubDepartmentsService } from './sub-departments.service';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => SubDepartment)
@UseGuards(GqlAuthGuard)
export class SubDepartmentsResolver {
  constructor(private readonly subDepartmentsService: SubDepartmentsService) {}

  @Mutation(() => SubDepartment)
  createSubDepartment(
    @Args('departmentId', { type: () => Int }) departmentId: number,
    @Args('input') createSubDepartmentInput: CreateSubDepartmentInput,
  ) {
    return this.subDepartmentsService.create(departmentId, createSubDepartmentInput);
  }

  @Query(() => [SubDepartment], { name: 'subDepartments' })
  findAll() {
    return this.subDepartmentsService.findAll();
  }

  @Query(() => SubDepartment, { name: 'subDepartment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subDepartmentsService.findOne(id);
  }

  @Mutation(() => SubDepartment)
  updateSubDepartment(
    @Args('input') updateSubDepartmentInput: UpdateSubDepartmentInput,
  ) {
    return this.subDepartmentsService.update(
      updateSubDepartmentInput.id,
      updateSubDepartmentInput,
    );
  }

  @Mutation(() => Boolean)
  removeSubDepartment(@Args('id', { type: () => Int }) id: number) {
    return this.subDepartmentsService.remove(id);
  }
}
