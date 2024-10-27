import { Module } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from 'src/model/complaint.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/model/user.entity';
import { ComplaintCategory } from 'src/model/complaint_category.entity';
import { District } from 'src/model/district.entity';
import { ComplaintState } from 'src/model/complaint_state.entity';
import { ComplaintStateService } from './complaints-state.service';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, User, ComplaintCategory, District, ComplaintState])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService, ComplaintStateService],
})
export class ComplaintsModule {}
