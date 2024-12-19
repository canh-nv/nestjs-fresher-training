import { CartItem } from "src/cart/entities/cart.entity";
import { Category } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Product {
          @PrimaryGeneratedColumn()
          id: number;

          @Column()
          productName: string

          @Column()
          productPrice: number

          @Column()
          productStock: number

          @CreateDateColumn()
          createAt: Date;

          @UpdateDateColumn()
          updateAt: Date;

          @ManyToOne(() => Category, (category) => category.products)
          category: Category;
          //relationship với cartItem

          // @OneToMany(() => CartItem,(cartItem)=>cartItem.product)
          // items:CartItem[];


}

