import { ApiProperty } from '@nestjs/swagger';

// INTERNAL
import { Department } from './department.entity';
import { IComponent } from '@/common/interfaces/IComponent';

export class DepartmentDto extends Department {
  @ApiProperty()
  id: string;

  @ApiProperty()
  departmentName: string;

  @ApiProperty()
  leaderId: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isComposite: boolean;

  @ApiProperty()
  departmentId: string;
}

export class ReqCreateDepartmentDto {
  @ApiProperty()
  departmentName: string;

  @ApiProperty({ required: false })
  leaderId?: string;

  @ApiProperty({ required: false })
  departmentId?: string;
}

export class ReqUpdateDepartmentDto {
  @ApiProperty({ required: false })
  departmentName?: string;

  @ApiProperty({ required: false })
  leaderId?: string;

  @ApiProperty({ required: false })
  departmentId?: string;

  @ApiProperty({ required: false })
  isActive?: boolean;
}

export class ResGetDepartmentByIdDto extends Department {
  @ApiProperty()
  id: string;

  @ApiProperty()
  departmentName: string;

  @ApiProperty()
  leaderId: string;

  @ApiProperty()
  isComposite: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  childs: IComponent[];
}
