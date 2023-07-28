import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { DatabaseModule } from 'src/database/database.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        DatabaseModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return { secret: configService.get('JWT_SECRETKEY') }
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
