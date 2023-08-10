import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// INTERNAL

@Entity()
export class TimeTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeid: string;

  @Column()
  date: Date;
  @Column()
  departmentid: string;

  @Column({ nullable: true })
  shiftid: number;

  @Column({ nullable: true })
  timekeepingid: number;

  @Column({ nullable: true })
  note: string;
}
