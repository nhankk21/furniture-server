import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';

// INTERNAL
import { DepartmentService } from './department.service';
import {
  DepartmentDto,
  ReqUpdateDepartmentDto,
  ResGetDepartmentByIdDto,
} from './department.dto';
import { IListResponse } from '@/common/interfaces/IListResponse';
import { IPagination } from '@/common/interfaces/IPagination';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  async findAll(
    @Query() { offset, limit }: IPagination,
  ): Promise<IListResponse<DepartmentDto>> {
    return this.departmentService.findAll(offset, limit);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  async findOne(@Param('id') id: string): Promise<ResGetDepartmentByIdDto> {
    const data = this.departmentService.findOne(id);
    return data;
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Validate field error.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() department: DepartmentDto): Promise<DepartmentDto> {
    return this.departmentService.create(department);
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
    @Body() newDepartmentData: ReqUpdateDepartmentDto,
  ): Promise<DepartmentDto> {
    return this.departmentService.update(id, newDepartmentData);
  }
}
