import { BadRequestException, Injectable, Query, Request } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { UpdateResult } from 'typeorm/driver/mongodb/typings';
import { error } from 'console';
import { fillterUserDTO } from './dto/filter-user.dto';

@Injectable()
export class UserService {
constructor(@InjectRepository(User) private userRepository:Repository<User>){}

  async findAll(query:fillterUserDTO):Promise<any> {
    const page = Number(query.page) || 1;
    const item_per_page = Number(query.item_per_page)||10; // Cái này là đối số take = lấy bnitem
// skip là sẽ xem là bỏ qua bn item và lấy item từ đoạn nào
    const skip = (page - 1)*item_per_page;
    const keyword = query.search || '';
    const [result,total] = await this.userRepository.findAndCount({
      where:[{firstName:Like('%' + keyword + '%')},
              {lastName:Like('%' + keyword + '%')},
              {email:Like('%' + keyword + '%')},
      ],
      order:{createAt:'DESC'},
      take:item_per_page,
      skip:skip,
      select:['id','firstName','lastName','email','age',
      'gender','role','createAt'
    ]});
    const lastPage = Math.ceil(total/item_per_page);
    const nextPage = page + 1 > lastPage? null: page + 1;
    const prePage = page - 1 < 1 ?null:page - 1;
    return{
      data:result,
      total,
      currentPage:page,
      lastPage,
      nextPage,
      prePage
    }
   
  }

  async findOneById(id: number):Promise<User> {
    return await this.userRepository.findOne({where:{id},select:['firstName','lastName','email','age',
      'gender','role'
    ]});
  }

  findOneByUsername(username:string) {
    return this.userRepository.findOne({where:{email:username}})
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<User> {
    await this.userRepository.update(id,updateUserDto);
   return await this.userRepository.findOne({where:{id}})
  }

  async remove(id: number):Promise<any> {
    const findUser = await this.userRepository.findOne({where:{id}});
    if (!findUser)
    {
      throw new BadRequestException('User not found');
    }
    await this.userRepository.delete(id);
    return 'delete success';
  }
  async updateAvatar(id:number,avatar:string):Promise<any>
  {
    return await this.userRepository.update(id,{avatar})
  }

}
