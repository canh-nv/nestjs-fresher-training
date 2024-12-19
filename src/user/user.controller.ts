import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, ForbiddenException, Query, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { fillterUserDTO } from './dto/filter-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { extname } from 'path';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all_User')
  findAll(@Query() query:fillterUserDTO) {
    console.log(query);
    return this.userService.findAll(query);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneById(+id);
  }


  @Patch('update/')
  update(@Body() updateUserDto: UpdateUserDto,@Req() req) {
    const userId = req.user.id;
    return this.userService.update(userId, updateUserDto,);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar',{
    storage:storageConfig('avatar'),
    fileFilter:(req,file,cb) =>
    {
      const ext = extname(file.originalname);
      const allowFile = ['.jpg','.png','.jpeg']
      if (!allowFile.includes(ext)){
        req.validatefile = 'wrong type'
        cb(null,false);
      }else{
        const filesize = parseInt(req.headers['content-length']);
        if (filesize > 5*1024*1024)
        {
           req.validatefile = 'to large.biggest is 5mb';
           cb(null,false);
        }
        else{
          cb(null,true)
        }
      }
    }
  
  }))
  uploadAvatar(@Req() req:any,@UploadedFile() file:Express.Multer.File)
  {
    console.log('upload')
    console.log(file)
    console.log(req.user)
    if (req.validatefile)
    {
      throw new BadRequestException(req.validatefile)
    }
    if (!file)
    {
      throw new BadRequestException('file is required')
    }
    this.userService.updateAvatar(req.user.id,file.destination +'/' + file.filename );
    return { message: 'Avatar uploaded successfully' };
  }
}
