import { ApiProperty } from '@nestjs/swagger';
import { Employee } from './employee.entity';

export class EmployeeDto extends Employee {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  gender: number;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false, default: true })
  isActive: boolean;

  @ApiProperty({ required: false, default: false })
  isComposite: boolean;

  @ApiProperty({ required: false })
  departmentId: string;

  @ApiProperty({ required: false })
  positionId: number;

  @ApiProperty({ required: false })
  titleId: number;

  @ApiProperty({ required: false, default: false })
  isLeader: boolean;
}

export class ReqCreateEmployeeDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  gender: number;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ default: true })
  isActive: boolean;

  @ApiProperty({ default: false })
  isComposite: boolean;

  @ApiProperty({ required: false })
  departmentId: string;

  @ApiProperty({ required: false })
  positionId: number;

  @ApiProperty({ required: false })
  titleId: number;

  @ApiProperty({ required: false, default: false })
  isLeader: boolean;
}

export class ReqUpdateEmployeeDto {
  @ApiProperty({ required: false })
  fullName: string;

  @ApiProperty({ required: false })
  gender: number;

  @ApiProperty({ required: false })
  dateOfBirth: Date;

  @ApiProperty({ required: false })
  address: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  departmentId: string;

  @ApiProperty({ required: false })
  positionId: number;

  @ApiProperty({ required: false })
  titleId: number;

  @ApiProperty({ required: false })
  isLeader: boolean;
}
