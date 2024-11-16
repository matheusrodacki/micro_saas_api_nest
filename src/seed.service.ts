import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './clientContext/users/users.service';
import { CreateUserDto } from './clientContext/users/dto/create.user.dto';
import { CreateClientDto } from './clientContext/clientTenants/dto/create.client.dto';
import { ClientsService } from './clientContext/clientTenants/client.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly clientService: ClientsService,
  ) {}

  async onModuleInit() {
    const clients = await this.clientService.findAll();
    if (clients.length === 0) {
      clients.push(
        await this.clientService.create({
          client_type: 'company',
          company: {
            company_name: 'Company Inc',
            tax_id_number: '123-45-6789',
            contact_person: 'John Doe',
          },
          status: 'active',
          notes: 'Some notes about the client',
        } as CreateClientDto),
      );
    }

    const users = await this.usersService.findByClientId(clients[0].client_id);
    if (users.length === 0) {
      await this.usersService.create({
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'yourpassword',
        phone: '1234567890',
        role: 'superadmin',
        clientId: clients[0].client_id,
      } as CreateUserDto);
    }
  }
}
