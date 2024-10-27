import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ComplaintState } from 'src/model/complaint_state.entity';
import { Complaint } from 'src/model/complaint.entity';
import { User } from 'src/model/user.entity';

@Injectable()
export class ComplaintStateService {
  constructor(
    @InjectRepository(ComplaintState)
    private readonly complaintStateRepository: Repository<ComplaintState>,
  ) {}

  // Crear un estado inicial para una queja
  async createInitialState(complaint: Complaint, user: User): Promise<ComplaintState> {
    const complaintState = this.complaintStateRepository.create({
      complaint_id: complaint.id,
      user_id: user.dni,
      state: 'PENDING', // Estado inicial predeterminado
    });

    return this.complaintStateRepository.save(complaintState);
  }
}
