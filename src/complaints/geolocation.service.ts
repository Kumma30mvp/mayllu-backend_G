import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from 'src/model/district.entity';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeolocationService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async findOrCreateDistrict(latitude: number, longitude: number): Promise<District> {
    // Llamada a la API de Google para obtener la información de ubicación
    const response = await firstValueFrom(
      this.httpService.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: process.env.GOOGLE_API_KEY,
        },
      }),
    );

    const results = response.data.results;
    const districtName = this.extractDistrictFromResults(results);

    // Verificar si el distrito ya existe en la base de datos
    let district = await this.districtRepository.findOne({ where: { name: districtName } });

    if (!district) {
      // Si el distrito no existe, créalo y guárdalo
      district = this.districtRepository.create({ name: districtName });
      await this.districtRepository.save(district);
    }

    return district;
  }

  private extractDistrictFromResults(results: any[]): string {
    // Busca en los resultados un objeto que tenga el tipo 'locality' en su array de types
    const districtResult = results.find((result) => result.types.includes('locality') && result.types.includes('political'));

    // Si encuentra el distrito, devuelve su nombre completo; de lo contrario, devuelve null
    if (districtResult) {
      const districtComponent = districtResult.address_components.find((component) => component.types.includes('locality'));
      return districtComponent ? districtComponent.long_name : null;
    }
    return null;
  }
}
