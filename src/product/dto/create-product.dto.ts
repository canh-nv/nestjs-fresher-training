import {IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
          @IsNotEmpty()
          @IsString()
          productName:string

          @IsNotEmpty()
          productPrice:number

          @IsNotEmpty()
          productStock:number

          @IsNotEmpty()
          @IsNumber()
          categoryId:number
}
