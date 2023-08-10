import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';

// INTERNAL
import { Department } from '@/modules/department/department.entity';
import { Employee } from '../employee/employee.entity';
import { TimeTable } from './schedule.entity';
// import {
//   DepartmentDto,
//   ReqUpdateDepartmentDto,
//   ResGetDepartmentByIdDto,
// } from '@/modules/department//department.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(TimeTable)
    private readonly timeTableRepository: Repository<TimeTable>,
    // private readonly connection: Connection,
  ) {}
    private getDatesForWeek(n: number): Date[] {
        const dates: Date[] = [];
        const today = new Date();
        const currentDayOfWeek = today.getDay();
        const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - currentDayOfWeek + 1 + n * 7);
      
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
          dates.push(date);
        }
      
        return dates;
    }
    private shuffleArray<T>(array: T[]): T[] {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    private async createSchedule(employees: Employee[], n: number, department: string): Promise<object> {
        const result: object = {};
        
        const morning = this.shuffleArray(employees);
        const afternoon = this.shuffleArray(employees);
        const length = Math.min(morning.length, afternoon.length);
        const dates = this.getDatesForWeek(n);
        for (let i = 0; i < length; i++) {
            let shift = {
                morning: {
                    id : morning[i]["id"],
                    name : morning[i]["fullName"],
                },
                afternoon: {
                    id : afternoon[i]["id"],
                    name : afternoon[i]["fullName"],
                },
                date: dates[i],
                departmentid: department, 
            };
            // for morning
            const morningTimeTable = new TimeTable()
            morningTimeTable.date = dates[i];
            morningTimeTable.employeeid = morning[i]["id"];
            morningTimeTable.shiftid = 2
            morningTimeTable.departmentid = department
            await this.timeTableRepository.save(morningTimeTable)

            // for afternoon
            const afternoonTimeTable = new TimeTable()
            afternoonTimeTable.employeeid = morning[i]["id"];
            afternoonTimeTable.date = dates[i];
            afternoonTimeTable.shiftid = 4
            afternoonTimeTable.departmentid = department
            await this.timeTableRepository.save(afternoonTimeTable)

            result[i] = shift;

        }
        return result;
    }
    async getScheduleFromDatabase(n: number): Promise<any>{
        const dates = this.getDatesForWeek(n);
        const schedules = await this.timeTableRepository.find({
            where: {
                date: In(dates),
            },
        });
        const departmentMap = new Map<string, TimeTable[]>();
        for(var s of schedules){
            if (departmentMap.has(s["departmentid"])) {
                departmentMap.get(s["departmentid"]).push(s);
            } else {
                departmentMap.set(s["departmentid"], [s]);
            }
        }
        var result: any[] = [];
        departmentMap.forEach(async (value, key) => {
            const department = await this.departmentRepository.findOne({
                where: {
                    id: key,
                },
            });
            const schedule: object = {};
            const dateMap = new Map<Date, TimeTable[]>();
            for(var item of value){
                const { date } = item;
                if (dateMap.has(date)) {
                    const list = dateMap.get(date)
                    list.push(item)
                    dateMap.set(date, list);
                } else {
                    const list :TimeTable[] = new Array();
                    list.push(item)
                    dateMap.set(date, list);
                }
            }
            const sortedDateMap = new Map<Date, TimeTable[]>(
                Array.from(dateMap).sort((a, b) => a[0].getTime() - b[0].getTime())
              );
            let count = 0;
            sortedDateMap.forEach(async (value, key) => {
                const shift: object = {};
                for(var i of value) {
                    const employee = await this.employeeRepository.findOne({
                        where: {
                            id: i.employeeid,
                        },
                    });
                    if(i.shiftid == 2) {
                        shift["morning"] = {
                            id : i.employeeid,
                            name : employee.fullName,
                        }
                    } else {
                        shift["afternoon"] = {
                            id : i.employeeid,
                            name : employee.fullName,
                        }
                    }
                }
                shift["date"] = key
                shift["departmentid"] = department.id
                schedule[count] = shift
                count++;
            });
            let response = {
                id: department.id,
                department_name: department.departmentName,
                schedule: schedule,
            };
            result.push(response);
        });

        return result;
    }
    async getSchedule(n: number): Promise<any> {
        const schedule = await this.getScheduleFromDatabase(n);
        if (schedule != null) {
            return schedule;
        }
        const departments = await this.departmentRepository.find({
            where: {
                departmentId: Not(IsNull()),
            },
        });
        
        var result: any[] = [];
        for(var department of departments) {
            const employees = await this.employeeRepository.find({
                where: {
                    departmentId: department["id"]
                },
            });
            const schedule = await this.createSchedule(employees, n, department["id"])
            let response = {
                id: department["id"],
                department_name: department["departmentName"],
                schedule: schedule,
            };
            result.push(response);
        }
        return result;
    }
    async getCurrentSchedule(): Promise<any> {
        return this.getSchedule(0);
    }
    async getNextSchedule(): Promise<any> {
        return this.getSchedule(1);
    }

//   async findChildDepartments(departmentId: string): Promise<Department[]> {
//     return this.departmentRepository.find({
//       where: {
//         departmentId: departmentId,
//       },
//     });
//   }

//   async findOne(id: string): Promise<ResGetDepartmentByIdDto> {
//     const departmentEntity = await this.departmentRepository.findOne({
//       where: {
//         id,
//       },
//     });
//     const result = new ResGetDepartmentByIdDto();
//     result.id = departmentEntity.id;
//     result.departmentId = departmentEntity.departmentId;
//     result.departmentName = departmentEntity.departmentName;
//     result.leaderId = departmentEntity.leaderId;
//     result.isActive = departmentEntity.isActive;
//     result.isComposite = departmentEntity.isComposite;

//     result.childs = [].concat(
//       // await this.employeeService.findEmployeesByDepartmentId(id),
//       await this.findChildDepartments(id),
//     );
//     return result;
//   }

//   async create(department: DepartmentDto): Promise<DepartmentDto> {
//     return this.departmentRepository.save(department);
//   }

//   async update(
//     id: string,
//     newDepartmentData: ReqUpdateDepartmentDto,
//   ): Promise<DepartmentDto> {
//     const department = await this.departmentRepository.findOne({
//       where: {
//         id,
//       },
//     });
//     if (department) {
//       department.departmentName =
//         newDepartmentData.departmentName ?? department.departmentName;
//       department.departmentId =
//         newDepartmentData.departmentId ?? department.departmentId;
//       if (department.isActive !== newDepartmentData.isActive) {
//         department.isActive = newDepartmentData.isActive;
//       }
//       department.leaderId = newDepartmentData.leaderId ?? department.leaderId;
//     }

//     await this.departmentRepository.update(id, department);
//     return department;
//   }

//   async delete(id: string): Promise<void> {
//     await this.departmentRepository.delete(id);
//   }
}
