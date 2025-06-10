import { Controller, Post, UseGuards, Get, Body, Req, Res } from '@nestjs/common';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Response } from "express";
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

    @Get('/profile')
    getProfile(@Req() req: any) {
        return req.user;
    }
}
