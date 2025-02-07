import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '../clients/client.entity';
import { Status } from 'src/enum/status.enum';
import { Plan } from '../plans/plan.entity';
import { Exclude } from 'class-transformer';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn()
  contract_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  contracted_price: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  contract_date: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ACTIVE,
  })
  status: Status;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @DeleteDateColumn()
  @Exclude()
  deleted_at?: Date;

  // Colunas de Chave Estrangeira
  @Column({ name: 'client_id' })
  client_id: number;

  @Column({ name: 'plan_id' })
  plan_id: number;

  //Relationships
  @ManyToOne(() => Client, (client) => client.contracts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => Plan, (plan) => plan.contracts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
