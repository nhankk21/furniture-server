import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// INTERNAL
import { Department } from './department.entity';
import {
  DepartmentDto,
  ReqUpdateDepartmentDto,
  ResGetDepartmentByIdDto,
} from './department.dto';
import { EmployeeService } from '../employee/employee.service';
import { IListResponse } from '@/common/interfaces/IListResponse';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    private readonly employeeService: EmployeeService,
  ) {}

  async findAll(offset = 0, limit = 5): Promise<IListResponse<DepartmentDto>> {
    console.log('offset :>> ', offset);
    const [employees, total] = await this.departmentRepository.findAndCount({
      skip: offset,
      take: limit,
      where: {
        isActive: true,
      },
    });
    return { total, data: employees };
  }

  async findChildDepartments(departmentId: string): Promise<Department[]> {
    return this.departmentRepository.find({
      where: {
        departmentId: departmentId,
      },
    });
  }

  async findOne(id: string): Promise<ResGetDepartmentByIdDto> {
    const departmentEntity = await this.departmentRepository.findOne({
      where: {
        id,
      },
    });
    const result = new ResGetDepartmentByIdDto();
    result.id = departmentEntity.id;
    result.departmentId = departmentEntity.departmentId;
    result.departmentName = departmentEntity.departmentName;
    result.leaderId = departmentEntity.leaderId;
    result.isActive = departmentEntity.isActive;
    result.isComposite = departmentEntity.isComposite;

    result.childs = [].concat(
      await this.employeeService.findEmployeesByDepartmentId(id),
      await this.findChildDepartments(id),
    );
    return result;
  }

  async create(department: DepartmentDto): Promise<DepartmentDto> {
    return this.departmentRepository.save(department);
  }

  async update(
    id: string,
    newDepartmentData: ReqUpdateDepartmentDto,
  ): Promise<DepartmentDto> {
    const department = await this.departmentRepository.findOne({
      where: {
        id,
      },
    });
    if (department) {
      department.departmentName =
        newDepartmentData.departmentName ?? department.departmentName;
      department.departmentId =
        newDepartmentData.departmentId ?? department.departmentId;
      if (department.isActive !== newDepartmentData.isActive) {
        department.isActive = newDepartmentData.isActive;
      }
      department.leaderId = newDepartmentData.leaderId ?? department.leaderId;
    }

    await this.departmentRepository.update(id, department);
    return department;
  }

  async delete(id: string): Promise<void> {
    await this.departmentRepository.delete(id);
  }
}
