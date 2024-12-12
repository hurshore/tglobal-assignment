import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubDepartment } from './entities/sub-department.entity';
import { Department } from './entities/department.entity';
import { CreateSubDepartmentInput } from './dto/create-sub-department.input';
import { UpdateSubDepartmentInput } from './dto/update-sub-department.input';

@Injectable()
export class SubDepartmentsService {
  constructor(
    @InjectRepository(SubDepartment)
    private subDepartmentRepository: Repository<SubDepartment>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(departmentId: number, createSubDepartmentInput: CreateSubDepartmentInput): Promise<SubDepartment> {
    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
      relations: ['subDepartments'],
    });

    if (!department) {
      throw new NotFoundException(`Department with ID "${departmentId}" not found`);
    }

    // Check if sub-department with the same name already exists in this department
    const existingSubDepartment = department.subDepartments?.find(
      (subDept) => subDept.name === createSubDepartmentInput.name
    );

    if (existingSubDepartment) {
      throw new ConflictException(
        `Sub-department with name "${createSubDepartmentInput.name}" already exists in this department`
      );
    }

    const subDepartment = this.subDepartmentRepository.create({
      ...createSubDepartmentInput,
      department,
    });

    return this.subDepartmentRepository.save(subDepartment);
  }

  async findAll(): Promise<SubDepartment[]> {
    return this.subDepartmentRepository.find({
      relations: ['department'],
    });
  }

  async findOne(id: number): Promise<SubDepartment> {
    const subDepartment = await this.subDepartmentRepository.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!subDepartment) {
      throw new NotFoundException(`Sub-department with ID "${id}" not found`);
    }

    return subDepartment;
  }

  async update(id: number, updateSubDepartmentInput: UpdateSubDepartmentInput): Promise<SubDepartment> {
    const subDepartment = await this.findOne(id);
    const department = await this.departmentRepository.findOne({
      where: { id: subDepartment.department.id },
      relations: ['subDepartments'],
    });

    // Check if the new name conflicts with existing sub-departments in the same department
    const existingSubDepartment = department.subDepartments?.find(
      (subDept) => subDept.name === updateSubDepartmentInput.name && subDept.id !== id
    );

    if (existingSubDepartment) {
      throw new ConflictException(
        `Sub-department with name "${updateSubDepartmentInput.name}" already exists in this department`
      );
    }

    subDepartment.name = updateSubDepartmentInput.name;
    return this.subDepartmentRepository.save(subDepartment);
  }

  async remove(id: number): Promise<boolean> {
    const subDepartment = await this.findOne(id);
    await this.subDepartmentRepository.remove(subDepartment);
    return true;
  }
}
