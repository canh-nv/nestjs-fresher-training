import { IsEmail, IsNotEmpty } from "class-validator";


export class loginDTO {
          @IsNotEmpty()
          @IsEmail()
          email:string

          @IsNotEmpty()
          password:string;

}
