import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '@/modules/department/department.entity';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Employee } from '../employee/employee.entity';
import { TimeTable } from './schedule.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Department, Employee, TimeTable])],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}