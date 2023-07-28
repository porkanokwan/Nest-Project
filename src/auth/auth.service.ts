import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common'
import { DatabaseService } from 'src/database/database.service'
import mssql from 'mssql'
import { AccountDTO } from './dto/account.dto'
import * as bycrypt from 'bcrypt'
import { User } from './auth.interface'
import { JwtService } from '@nestjs/jwt'
import { Payload } from './payload.interface'

@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService,
        private jwtService: JwtService,
    ) {}

    async findUser(username: string) {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('username', mssql.NVarChar, username)
        const { recordset } = await request.execute<User>('dbo.sp_find_user')

        return recordset[0]
    }

    async deleteUser(username: string) {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('username', mssql.NVarChar, username)
        const result = await request.execute<User>('dbo.sp_delete_user')

        return result.rowsAffected
    }

    async signup(account: AccountDTO) {
        const { username, password } = account

        // hash password
        const salt = await bycrypt.genSalt() // เพิ่มความปลอดภัยทำให้ password เดียวกันได้ hash มาไม่เหมือนกัน
        const hashPassword = await bycrypt.hash(password, salt)

        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('username', mssql.NVarChar, username)
        request.input('password', mssql.NVarChar, hashPassword)
        const result = await request.execute<User>('dbo.sp_create_user')

        return result.recordset[0]
    }

    async signin(account: AccountDTO) {
        const { username, password } = account
        // ดึงข้อมูล user จาก db
        const user = await this.findUser(username)
        if (!user) {
            throw new NotFoundException('user not found')
        }

        // compare
        const isMatch = await bycrypt.compare(password, user.password)

        // โดยปกติแล้วต้องคืน Token(เครื่องหมายยืนยันตัวตนว่า login ผ่าน) ให้ client เอาไปใช้ต่อ
        if (isMatch) {
            // ไม่ควรใส่อะไรที่สำคัญเช่น password
            const payload: Payload = {
                username,
            }
            const accessToken = this.jwtService.sign(payload)
            return { accessToken }
        } else {
            throw new UnauthorizedException(
                'please check your username or password',
            )
        }
    }
}
