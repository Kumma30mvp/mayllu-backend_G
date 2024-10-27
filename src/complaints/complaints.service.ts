import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Complaint } from 'src/model/complaint.entity';
import { Repository } from 'typeorm';
import { User } from 'src/model/user.entity';
import { ComplaintCategory } from 'src/model/complaint_category.entity';
import { District } from 'src/model/district.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ComplaintCategory)
    private readonly categoryRepository: Repository<ComplaintCategory>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async findAllComplaints() {
    return await this.complaintRepository.find({
      relations: [
        'user', // Incluye la relación con el usuario
        'category', // Incluye la relación con la categoría de quejas
        'district', // Incluye la relación con el distrito
        'complaints_image', // Incluye las imágenes de la queja
        'comments', // Incluye los comentarios
        'complaintState', // Incluye el estado de la queja
      ],
    });
  }

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    // Convertir latitude y longitude a un string tipo "point" para la base de datos
    createComplaintDto.created_at = new Date(createComplaintDto.created_at);
    createComplaintDto.updated_at = new Date(createComplaintDto.updated_at);
    const { latitude, longitude, userId, categoryId, districtId } = createComplaintDto;
    const formattedUbication = `(${latitude}, ${longitude})`;

    const user = await this.userRepository.findOne({ where: { dni: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    const district = await this.districtRepository.findOne({ where: { id: districtId } });
    if (!district) {
      throw new Error(`District with ID ${districtId} not found`);
    }

    // Crear la entidad con las relaciones utilizando objetos parciales
    const complaint = this.complaintRepository.create({
      user: user,
      ubication: formattedUbication,
      category: category,
      district: district,
      title: createComplaintDto.title,
      description: createComplaintDto.description,
      created_at: createComplaintDto.created_at,
      updated_at: createComplaintDto.updated_at,
    });

    const savedComplaint = await this.complaintRepository.save(complaint);

    // Crear el estado inicial en ComplaintState
    // await this.complaintStateService.createInitialState(savedComplaint, user);

    return savedComplaint;
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto): Promise<Complaint> {
    // Busca la queja existente por su ID
    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }

    // Extrae la información del DTO
    const { latitude, longitude, categoryId, districtId } = updateComplaintDto;

    // Si hay coordenadas nuevas, conviértalas a formato "point"
    if (latitude !== undefined && longitude !== undefined) {
      complaint.ubication = `(${latitude}, ${longitude})`;
    }

    // Actualiza solo las propiedades que están presentes en el DTO

    if (categoryId !== undefined) {
      // Crear el objeto completo solo si 'categoryId' está definido
      complaint.category = { id: categoryId } as ComplaintCategory;
    }

    if (districtId !== undefined) {
      complaint.district = { id: districtId } as District;
    }

    if (updateComplaintDto.description !== undefined) {
      complaint.description = updateComplaintDto.description;
    }

    // Actualiza la fecha de modificación
    complaint.updated_at = new Date();

    // Guarda la queja actualizada en la base de datos
    return this.complaintRepository.save(complaint);
  }

  async findOneComplaint(id: number): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({ where: { id } });

    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }

    return complaint;
  }

  async remove(id: number): Promise<void> {
    const complaint = await this.complaintRepository.findOne({ where: { id } });

    if (!complaint) {
      throw new Error(`Complaint with ID ${id} not found`);
    }

    await this.complaintRepository.remove(complaint);
  }
}
