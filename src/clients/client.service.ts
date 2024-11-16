import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto } from './dto/create.client.dto';
import { UpdateClientDto } from './dto/update.client.dto';
import { Individual } from 'src/individuals/individual.entity';
import { Company } from 'src/companies/company.entity';
import { AddressesService } from 'src/addresses/addresses.service';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Individual)
    private individualRepository: Repository<Individual>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private addressesService: AddressesService,
  ) {}

  async create(createClientsDto: CreateClientDto): Promise<Client> {
    let client = this.clientRepository.create(createClientsDto);
    client = await this.clientRepository.save(client); // Save the client first

    // Create individual or company if applicable
    if (
      createClientsDto.client_type === 'individual' &&
      createClientsDto.individual
    ) {
      const individual = this.individualRepository.create({
        ...createClientsDto.individual,
        client,
      });
      await this.individualRepository.save(individual);
      client.individual = individual;
    } else if (
      createClientsDto.client_type === 'company' &&
      createClientsDto.company
    ) {
      const company = this.companyRepository.create({
        ...createClientsDto.company,
        client,
      });
      await this.companyRepository.save(company);
      client.company = company;
    }

    // Create address if provided
    if (createClientsDto.address) {
      await this.addressesService.create(
        createClientsDto.address,
        client.client_id,
      );
    }

    return client;
  }

  async findAll(): Promise<Client[]> {
    return await this.clientRepository.find({
      relations: ['individual', 'company', 'users', 'addresses'],
    });
  }

  async findOne(client_id: number): Promise<Client> {
    return this.clientRepository.findOne({
      where: { client_id },
      relations: ['individual', 'company', 'users', 'addresses'],
    });
  }

  async update(
    client_id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { client_id },
      relations: ['users'],
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, updateClientDto);
    return await this.clientRepository.save(client);
  }

  async remove(client_id: number): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { client_id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    await this.clientRepository.remove(client);
  }
}
