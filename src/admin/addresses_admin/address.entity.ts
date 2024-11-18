import { Client } from 'src/admin/clients_tenants/client.entity';
import { AddressType } from 'src/enum/addressType.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  additionalInfo: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  postalCode: string;

  @Column({ type: 'enum', enum: AddressType })
  address_type: AddressType;

  // Relationships
  @ManyToOne(() => Client, (client) => client.addresses)
  client: Client;
}
