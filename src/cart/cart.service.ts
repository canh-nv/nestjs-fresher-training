import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartItemDto } from './dto/createCartItem';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { UpdateCartItemDto } from './dto/update-cart.dto';


@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private usersService: UserService,
    private productsService: ProductService,
  ) { }
  async findOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({ where: { user: { id: userId } } });
   
    if (!cart) {
      const user = await this.usersService.findOneById(userId);
      if (!user) {
        throw new NotFoundException('User Not found');
      }
      cart = this.cartRepository.create({ user, items: [] }); // Đảm bảo rằng user đã được gán đúng
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }
  async checkCart(userId: number): Promise <Cart | null> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: [ 'items','items.product'],
    });
    if (cart) {
      return cart;
    }else{
      return await this.findOrCreateCart(userId);
    } 
  }
  async addItem(userId: number, CreateCartItemDto: CreateCartItemDto): Promise<Cart> {
    try {
      const cart = await this.checkCart(userId);

      if (!cart) {
        throw new NotFoundException('deo thay cart');
        
      }
      if (!cart.items) {
        cart.items = [];
      }
     

      const { productId, quantity } = CreateCartItemDto;
      if (!productId || !quantity) {
        throw new NotFoundException('product not found');
      }
      const product = await this.productsService.findOne(productId);

      if (!product) {
        throw new NotFoundException('product not found');
      }

      let cartItem = cart.items.find(item =>item.product && item.product.id === productId)
      if (cartItem ) {
      console.log(cartItem);

        cartItem.quantity += quantity
     
        
      } 
      else {
     
        cartItem = this.cartItemRepository.create({ cart, quantity, product });
        console.log(cartItem.quantity)
        cart.items.push(cartItem);
      }
      await this.cartItemRepository.save(cartItem);
      return this.cartRepository.save(cart);
    } catch (error) {
      console.log('error', error);
    }
  }
  //update item
  async updateItem(userId: number, cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items','user'],  
    });
  
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
   
    const cartItem = cart.items.find(item => item.id == cartItemId);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
  
    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }
  //xoa sản phẩm khỏi cart
  async removeItem(userId: number, cartItemId: number): Promise<Cart> {
    try {
      // Kiểm tra giỏ hàng của người dùng
      const cart = await this.checkCart(userId);
      
      // In giá trị của cartItemId để kiểm tra
      console.log('cartItemId:', cartItemId);
      
      // In giỏ hàng để kiểm tra các mục
      console.log('Current cart items:', cart.items.map(item => item.id));
  
      // Tìm vị trí của sản phẩm trong giỏ hàng
      const cartItemIndex = cart.items.findIndex(item => item.id === Number(cartItemId));
      
      // In vị trí của cartItem để kiểm tra
      console.log('Found cartItemIndex:', cartItemIndex);
  
      // Nếu không tìm thấy sản phẩm, báo lỗi
      if (cartItemIndex === -1) {
        throw new NotFoundException('Cart item not found');
      }
  
      // Xóa sản phẩm khỏi giỏ hàng
      const [cartItem] = cart.items.splice(cartItemIndex, 1);
  
      // In ra sản phẩm đã xóa để xác nhận
      console.log('Removed cartItem:', cartItem);
  
      // Xóa sản phẩm trong cơ sở dữ liệu
      await this.cartItemRepository.remove(cartItem);
  
      // Lưu giỏ hàng đã cập nhật lại
      return await this.cartRepository.save(cart);
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo lỗi
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.checkCart(userId);
    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
    await this.cartRepository.save(cart);
  }
  async getCartSummary(userId: number): Promise<Cart> {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],  // Đảm bảo nạp đầy đủ quan hệ product
    });
  }

}


