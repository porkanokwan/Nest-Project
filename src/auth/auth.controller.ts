import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common'
import { HttpCode } from '@nestjs/common/decorators'
import { AuthService } from './auth.service'
import { AccountDTO } from './dto/account.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('user/:username')
    findUser(@Param('username') username: string) {
        return this.authService.findUser(username)
    }

    @Delete('user/:username')
    deleteUser(@Param('username') username: string) {
        return this.authService.deleteUser(username)
    }

    @Post('/signup')
    signup(@Body() body: AccountDTO) {
        return this.authService.signup(body)
    }

    @HttpCode(200) // ใช้ในการกำหนด StatusCode ที่ต้องการ
    @Post('signin')
    signin(@Body() body: AccountDTO) {
        return this.authService.signin(body)
    }
}
