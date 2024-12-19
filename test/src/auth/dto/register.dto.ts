import { IsEmail, IsNotEmpty, IsString, } from "class-validator";

export class registerUserDTO {

          @IsNotEmpty()
          @IsString()
          firstName: string;

          @IsNotEmpty()
          @IsString()
          lastName: string;
        
          @IsNotEmpty()
          @IsEmail()
          email:string
        

          @IsNotEmpty()
          password:string
        

          @IsNotEmpty()
          age:number
        
          @IsNotEmpty()
          gender:string
}
