import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

// INTERNAL
import { EmployeeService } from './employee.service';
import { Employee } from './employee.entity';
import {
  EmployeeDto,
  ReqCreateEmployeeDto,
  ReqUpdateEmployeeDto,
} from './employee.dto';
import { IListResponse } from '@/common/interfaces/IListResponse';
import { IPagination } from '@/common/interfaces/IPagination';

@Controller('employee')
@ApiTags('Employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  async findAll(
    @Query() { offset, limit }: IPagination,
  ): Promise<IListResponse<EmployeeDto>> {
    return this.employeeService.findAll(offset, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  async findOne(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validate field error.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() employee: ReqCreateEmployeeDto): Promise<EmployeeDto> {
    return this.employeeService.create(employee);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Validate field error.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Param('id') id: string,
    @Body() employee: ReqUpdateEmployeeDto,
  ): Promise<EmployeeDto> {
    return this.employeeService.update(id, employee);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.employeeService.delete(id);
  }
}
