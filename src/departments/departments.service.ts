import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { PaginationInput } from '../common/dto/pagination.input';
import { IPaginatedType } from '../common/dto/pagination-response';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(SubDepartment)
    private subDepartmentRepository: Repository<SubDepartment>,
  ) {}

  async create(createDepartmentInput: CreateDepartmentInput): Promise<Department> {
    // Check if department with the same name already exists
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: createDepartmentInput.name },
    });

    if (existingDepartment) {
      throw new ConflictException(`Department with name "${createDepartmentInput.name}" already exists`);
    }

    const department = this.departmentRepository.create({
      name: createDepartmentInput.name,
      subDepartments: createDepartmentInput.subDepartments?.map(subDept => 
        this.subDepartmentRepository.create({ name: subDept.name })
      ),
    });

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException(`Department with name "${createDepartmentInput.name}" already exists`);
      }
      throw error;
    }
  }

  async findAll(paginationInput?: PaginationInput): Promise<IPaginatedType<Department>> {
    const { page = 1, limit = 10 } = paginationInput || {};
    const skip = (page - 1) * limit;

    const [items, total] = await this.departmentRepository.findAndCount({
      relations: ['subDepartments'],
      order: { name: 'ASC' },
      take: limit,
      skip: skip,
    });

    const hasMore = total > page * limit;

    return {
      items,
      total,
      page,
      limit,
      hasMore,
    };
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found`);
    }

    return department;
  }

  async findByName(name: string): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { name },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException(`Department with name "${name}" not found`);
    }

    return department;
  }

  async update(updateDepartmentInput: UpdateDepartmentInput): Promise<Department> {
    const { id, name } = updateDepartmentInput;

    // Check if department exists
    const department = await this.findOne(id);

    // Check if new name is already taken by another department
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name },
    });

    if (existingDepartment && existingDepartment.id !== id) {
      throw new ConflictException(`Department with name "${name}" already exists`);
    }

    // Update the department
    department.name = name;

    try {
      return await this.departmentRepository.save(department);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new ConflictException(`Department with name "${name}" already exists`);
      }
      throw error;
    }
  }

  async remove(id: number): Promise<boolean> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
    return true;
  }
}
