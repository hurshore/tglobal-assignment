import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { Department } from './entities/department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginatedDepartmentResponse } from './dto/paginated-departments.response';

@Resolver(() => Department)
@UseGuards(GqlAuthGuard)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Mutation(() => Department)
  createDepartment(@Args('input') createDepartmentInput: CreateDepartmentInput) {
    return this.departmentsService.create(createDepartmentInput);
  }

  @Query(() => PaginatedDepartmentResponse, { name: 'departments' })
  findAll(@Args('pagination', { nullable: true }) pagination?: PaginationInput) {
    return this.departmentsService.findAll(pagination);
  }

  @Query(() => Department, { name: 'department' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Query(() => Department, { name: 'departmentByName' })
  findByName(@Args('name') name: string) {
    return this.departmentsService.findByName(name);
  }

  @Mutation(() => Department)
  updateDepartment(@Args('input') updateDepartmentInput: UpdateDepartmentInput) {
    return this.departmentsService.update(updateDepartmentInput);
  }

  @Mutation(() => Boolean)
  removeDepartment(@Args('id', { type: () => Int }) id: number) {
    return this.departmentsService.remove(id);
  }
}
