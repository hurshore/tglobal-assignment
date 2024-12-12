import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { SubDepartment } from './entities/sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';

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

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({
      relations: ['subDepartments'],
      order: {
        name: 'ASC', // Sort departments by name
      },
    });
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
}
