import { Exclude } from 'class-transformer';
import { Client } from '../clients_tenants/client.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryColumn()
  client_id: number;

  @Column()
  company_name: string;

  @Column()
  tax_id_number: string;

  @Column()
  contact_person: string;

  @Column()
  teste_coluna: string;

  // Relationships
  @OneToOne(() => Client, (client) => client.company)
  @JoinColumn({ name: 'client_id' })
  @Exclude()
  client: Client;
}
