import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { ComplaintCategory } from './complaint_category.entity';
import { District } from './district.entity';
import { ComplaintImage } from './complaint_image.entity';
import { ComplaintState } from './complaint_state.entity';
import { Comment } from './comment.entity';

@Entity({ name: 'complaint' })
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn({ name: 'user_id' }) // Ajusta el nombre de la columna si es necesario
  user: User;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'point' })
  ubication: string;

  @ManyToOne(() => ComplaintCategory, (category) => category.complaints)
  @JoinColumn({ name: 'category_id' }) // Ajusta el nombre de la columna si es necesario
  category: ComplaintCategory;

  @ManyToOne(() => District, (district) => district.complaints)
  @JoinColumn({ name: 'district_id' }) // Ajusta el nombre de la columna si es necesario
  district: District;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ComplaintImage, (complaint_image) => complaint_image.complaint)
  complaints_image: ComplaintImage[];

  @OneToMany(() => Comment, (comment) => comment.complaint)
  comments: Comment[];

  @OneToMany(() => ComplaintState, (complaintState) => complaintState.complaint)
  @JoinColumn([
    { name: 'id', referencedColumnName: 'complaint_id' },
    { name: 'user_id', referencedColumnName: 'user_id' },
  ])
  complaintState: ComplaintState;
}
