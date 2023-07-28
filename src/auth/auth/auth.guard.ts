import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    // return true จะผ่านไปทำ controller ได้ ดังนั้นต้องเอา Authorization จาก header มาเช็คก่อน
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest<Request>()
        const { authorization: accessToken } = request.headers
        try {
            this.jwtService.verify(accessToken)
            return true
        } catch (err) {
            throw new UnauthorizedException('Invalid token')
        }
    }
}
