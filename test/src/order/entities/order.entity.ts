import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Order {
          @PrimaryGeneratedColumn()
          id: number;

          @ManyToOne(() => User, (user) => user.orders)
          user: User;

          @Column()
          status: string; // 'placed', 'shipped', 'delivered', 'cancelled', 'returned'

          @Column('decimal')
          total: number;

          @CreateDateColumn()
          createdAt: Date;

          @UpdateDateColumn()
          updatedAt: Date;
          // Mối quan hệ với orderItem
          @OneToMany(() => OrderItem,(orderItem) => orderItem.order )
          items:OrderItem[];
}
@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(()=>Order,(order)=>order.items,{ onDelete: 'CASCADE' })
  order:Order;

  @ManyToOne(()=> Product,(product)=>product.id)
  product:Product
}