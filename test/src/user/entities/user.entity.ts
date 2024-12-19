
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  age: number

  @Column()
  gender: string

  @Column({ default: 'User' })
  role: string;

  @Column({ default: '' })
  refresh_token: string;

  @Column({ default: null,nullable:true })
  avatar:string

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[]; 
}