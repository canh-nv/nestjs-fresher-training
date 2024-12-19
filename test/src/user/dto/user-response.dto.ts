import { StrictMatchKeysAndValues } from "typeorm";

export class responeseDTO {
          id:number;
          firstName: string;
          lastName: string;
          age:number;
          gender:string
          role:string;
          createAt:Date;
          deleteAt:Date;
}