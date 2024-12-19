import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cart {
          @PrimaryGeneratedColumn()
          id: number;

          // đây là phần relation ship

          //1 user relationship
          @ManyToOne(() => User, (user) => user.carts)
          user: User;
          //2 cartItem relationship
          @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
          items: CartItem[];
}

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number; // Số lượng

    // Mối quan hệ với Cart
    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(()=>Product,(product)=>product.id)
    product:Product
   
}