import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './users.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from "express";
import * as ms from 'ms';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }


    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                return user;
            }
        }
        return null;
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
        });
        return refresh_token;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };

        // Update user with refresh token
        const refresh_token = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(refresh_token, _id);
        // End update user with refresh token

        // Set cookie
        response.cookie('refresh_token', refresh_token, {
            // @ts-ignore
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
            httpOnly: true
        });
        // End Set cookie

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        let newUser = await this.usersService.register(registerUserDto);

        return {
            _id: newUser?._id,
            createAt: newUser?.createdAt
        }
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            })

            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                // Update refresh token
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token login",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };

                // Update user with refresh token
                const refresh_token = this.createRefreshToken(payload);
                await this.usersService.updateUserToken(refresh_token, _id.toString());
                // End update user with refresh token

                // Set cookie
                response.clearCookie('refresh_token');

                response.cookie('refresh_token', refresh_token, {
                    // @ts-ignore
                    maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE")),
                    httpOnly: true
                });
                // End Set cookie

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };
            }

            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login.");
        } catch (error) {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login.");
        }
    }

    async logout(response: Response, user: IUser) {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie('refresh_token');
        return "ok";
    }
}
