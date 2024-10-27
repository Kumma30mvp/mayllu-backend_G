import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Complaint } from './complaint.entity';

@Entity({ name: 'complaint_state' })
export class ComplaintState {
  @PrimaryColumn({ type: 'bigint' })
  complaint_id: number;

  @PrimaryColumn({ type: 'char', length: 8 })
  user_id: string;

  @Column({ type: 'enum', enum: ['PENDING', 'RESOLVED'] })
  state: string;

  // @PrimaryColumn({ type: 'bigint' })
  @ManyToOne(() => Complaint, (complaint) => complaint.complaintState)
  @JoinColumn({ name: 'complaint_id' })
  complaint: Complaint;
}
