import { IComponent } from '@/common/interfaces/IComponent';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// INTERNAL

@Entity()
export class Employee implements IComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  gender: number;

  @Column()
  dateOfBirth: Date;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isComposite: boolean;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ nullable: true })
  positionId: number;

  @Column({ nullable: true })
  titleId: number;

  @Column({ default: false })
  isLeader: boolean;
}
