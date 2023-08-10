import { Body, Controller, Get, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('schedule')
@ApiTags('Schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getCurrentSchedule(): any {
    return this.scheduleService.getCurrentSchedule();
  }
  @Get('/next')
  getNextSchedule(): any {
    return this.scheduleService.getNextSchedule();
  }

}