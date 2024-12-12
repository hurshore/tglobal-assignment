import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsService } from './departments.service';
import { DepartmentsResolver } from './departments.resolver';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { SubDepartmentsService } from './sub-departments.service';
import { SubDepartmentsResolver } from './sub-departments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [
    DepartmentsResolver,
    DepartmentsService,
    SubDepartmentsResolver,
    SubDepartmentsService,
  ],
})
export class DepartmentsModule {}
