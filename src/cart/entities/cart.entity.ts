import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

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
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.id)
    product: Product;
}
