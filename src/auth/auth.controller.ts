import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { Public } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Public()
    @Post("/login")
    @UseGuards(LocalAuthGuard)
    handleLogin(@Request() req) {
        return this.authService.login(req.user);
    }

    @Get('/profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
