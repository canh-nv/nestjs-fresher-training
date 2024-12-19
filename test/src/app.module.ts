import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),DatabaseModule, UserModule
    ,AuthModule, ProductModule, CategoryModule, CartModule, OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
