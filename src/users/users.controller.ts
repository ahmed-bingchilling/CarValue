import { CreateUserDto } from './dtos/create-user.dto';
import { Body, Controller, Post, Get,Patch,Param, Query, Delete, NotFoundException,UseInterceptors, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { updateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {


    constructor(private usersService: UsersService,private authService:AuthService ){
    }

   
    @Get( '/whoami')
    whoAmI(@Session() session:any){
        return this.usersService.findOne(session.userId)
    }

    @Post('/signout')
    signOut(@Session() session:any){
        session.userId=null
    }

    @Post('/signup')
    async createUser(@Body() body:CreateUserDto, @Session() session:any ){
           const user= await this.authService.signup(body.email, body.password)
           session.userId= user.id
           return user
    }

    @Post('/signin')
   async signin (@Body() body:CreateUserDto, @Session() session:any){
       const user= await this.authService.signin(body.email, body.password)
       session.userId= user.id
       return user
    }
    
    @Get('/:id')
    async findUser(@Param('id') id:string){
        console.log('handler is running')
        const user= await this.usersService.findOne(+(id))
        if(!user){
            throw new NotFoundException(`no user found with id ${id}`)
        }
        return this.usersService.findOne(+(id))
    }
    
    @Get()
    findAllUsers(@Query('email') email:string){
        return this.usersService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.usersService.remove(+(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body:updateUserDto ){
        return this.usersService.update(+(id), body)

    }
}
