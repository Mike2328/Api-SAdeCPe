import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user-entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRP: Repository<UserEntity>,
        private jwtTokenService: JwtService
    ){}

    async loginWithCredentials(username: string, password: string) {
        const user = await this.userRP
                    .createQueryBuilder("user")
                    .where("user.username = :username", { username: `${username}` })
                    .getOne();

        if (user && user.password === password) {
            const {password, ...result} = user;
            const payload = { username: user.username, sub: user.userId };

            return {
                access_token: this.jwtTokenService.sign(payload),
            };
        }
        throw new HttpException(`Nombre de Usuario o Contraseña Incorrecta`, HttpStatus.NOT_FOUND);
    }
}