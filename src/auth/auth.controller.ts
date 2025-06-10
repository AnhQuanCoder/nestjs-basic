import { Controller, Post, UseGuards, Get, Body, Req, Res } from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from "express";
import { IUser } from './users.interface';
import { Request } from 'express';
@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @Post("/login")
    @UseGuards(LocalAuthGuard)
    handleLogin(@Req() req: any, @Res({ passthrough: true }) response: Response) {
        return this.authService.login(req.user, response);
    }

    @Post("/register")
    @Public()
    @ResponseMessage("Register a new user")
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Get('/account')
    @ResponseMessage("Get user infomation")
    handleGetAccount(@User() user: IUser) {
        return {
            user
        }
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage("Get user by refresh token")
    handleRefresh(@Req() request: Request, @Res() response: Response) {
        const refreshToken = request.cookies["refresh_token"];
        return this.authService.processNewToken(refreshToken, response);
    }
}
