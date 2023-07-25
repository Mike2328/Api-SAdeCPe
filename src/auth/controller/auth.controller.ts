import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authservice: AuthService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async loginWithCredentials(@Body() user: any){
        if(user.username && user.password){
            return await this.authservice.loginWithCredentials(user.username, user.password);
        }
        throw new HttpException(`Se requiere username y password`, HttpStatus.NOT_FOUND);
    }
}