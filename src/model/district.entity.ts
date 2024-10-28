import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Complaint } from './complaint.entity';

@Entity({ name: 'district' })
export class District {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Complaint, (complaint) => complaint.district)
  complaints: Complaint[];
}
