import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

          @IsOptional()
          @IsString()
          name?: string;
          
          @IsNotEmpty()
          productPrice:number

          @IsNotEmpty()
          productStock:number

          @IsOptional()
          @IsNumber()
          categoryId?: number;
}
