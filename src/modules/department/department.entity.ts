import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// INTERNAL
import { IComponent } from '@/common/interfaces/IComponent';

@Entity()
export class Department implements IComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  departmentName: string;

  @Column({ nullable: true })
  leaderId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  isComposite: boolean;

  @Column({ nullable: true })
  departmentId: string;
}
