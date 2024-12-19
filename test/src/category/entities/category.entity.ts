import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {
          @PrimaryGeneratedColumn()
          id:number;

          @Column()
          categoryName:string

          @CreateDateColumn()
          createAt:Date

          @UpdateDateColumn()
          updateAt:Date

          @OneToMany(()=>Product,(product) =>product.category)
          //ở đây để products được gọi là 1 mảng các sản phâmr vì 1 cate có nhiều sản phẩm
          products:Product[]
}
