import { Controller, Post, Get, Patch, Delete, Param, Body, Req, NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/createCartItem';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { AuthRequest } from 'src/auth/interfaces/authRequst.interfaces';
import { OrderService } from 'src/order/order.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService,
    private readonly orderService:OrderService
  ) { }



  @Post('add')
  addItem(@Req() req: AuthRequest, @Body() createCartItemDto: CreateCartItemDto) {
    const userId = req.user.id;
    return this.cartService.addItem(userId, createCartItemDto);
  }

  @Patch('update/:itemId')
  updateItem(@Req() req: AuthRequest, @Param('itemId') itemId: number, @Body() updateCartItemDto: UpdateCartItemDto) {
    const userId = req.user.id
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete('remove/:itemId')
  removeItem(@Req() req: AuthRequest, @Param('itemId') itemId: number) {
    const userId = req.user.id;
    return this.cartService.removeItem(userId, itemId);
  }
  @Get('summary')
  getCartSummary(@Req() req: AuthRequest) {
    const userId = req.user.id;
    return this.cartService.getCartSummary(userId);
  }

  @Post('checkout')
  async checkout(@Req() req: AuthRequest) {
    const userId = req.user.id;
    const cart = await this.cartService.getCartSummary(userId);


    // Kiểm tra giỏ hàng trống
    if (!cart.items.length) {
      return { message: 'Giỏ hàng trống. Không thể thanh toán.' };
    }

    const createOrderDto = {
      userId: userId,
      items: cart.items.map(item => {
        if (!item.product || !item.product.id) {
          throw new NotFoundException('Product not found for cart item');
        }
        return {
          productId: item.product.id,
          quantity: item.quantity,
        };
      }),
    };
  const order = await this.orderService.create(createOrderDto);
    await this.cartService.clearCart(userId);
    return { message: 'Checkout successful' };
  }

}