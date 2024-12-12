import { ObjectType } from '@nestjs/graphql';
import { Department } from '../entities/department.entity';
import { Paginated } from '../../common/dto/pagination-response';

@ObjectType()
export class PaginatedDepartmentResponse extends Paginated(Department) {}
