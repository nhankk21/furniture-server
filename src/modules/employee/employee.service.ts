import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// INTERNAL
import { Employee } from '@/modules/employee/employee.entity';
import {
  EmployeeDto,
  ReqCreateEmployeeDto,
  ReqUpdateEmployeeDto,
} from './employee.dto';
import { IListResponse } from '@/common/interfaces/IListResponse';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async findAll(offset = 0, limit = 5): Promise<IListResponse<EmployeeDto>> {
    const [employees, total] = await this.employeeRepository.findAndCount({
      skip: offset,
      take: limit,
      where: {
        isActive: true,
      },
    });
    return { total, data: employees };
  }

  async findEmployeesByDepartmentId(
    departmentId: string,
  ): Promise<EmployeeDto[]> {
    return this.employeeRepository.find({
      where: {
        departmentId: departmentId,
      },
    });
  }

  async findOne(id: string): Promise<Employee> {
    return this.employeeRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(employee: ReqCreateEmployeeDto): Promise<EmployeeDto> {
    return this.employeeRepository.save(employee);
  }

  async update(
    id: string,
    employee: ReqUpdateEmployeeDto,
  ): Promise<EmployeeDto> {
    await this.employeeRepository.update(id, employee);
    return this.employeeRepository.findOne({
      where: {
        id,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
