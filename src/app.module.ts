import { Module } from '@nestjs/common'
import { TasksModule } from './tasks/tasks.module'
import { DatabaseModule } from './database/database.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config/dist/config.service'
// import { AuthGuard } from './auth/auth/auth.guard'

@Module({
    imports: [
        TasksModule,
        DatabaseModule,
        AuthModule,
        // JwtModule.register({
        // set secret key ผ่าน module
        //     secret: 'secretKey',
        //     signOptions: {
        //         expiresIn: '7d'
        //     }
        // })
        // Inject ConfigService เพื่อเรียกใช้ JWT_SECRETKEY ใน env
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return { secret: configService.get('JWT_SECRETKEY') }
            },
        }),
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`],
        }),
    ],
    // เป็นการประกาศใช้ AuthGuard ได้กับทุก Controller
    // providers: [
    //     {
    //         provide: 'APP_GUARD',
    //         useClass: AuthGuard,
    //     },
    // ],
})
export class AppModule {}
