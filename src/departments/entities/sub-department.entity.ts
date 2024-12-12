import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from './department.entity';

@ObjectType()
@Entity()
export class SubDepartment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Department)
  @ManyToOne(() => Department, (department) => department.subDepartments, {
    onDelete: 'CASCADE',
  })
  department: Department;
}
