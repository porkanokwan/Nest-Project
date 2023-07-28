import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist/config.service'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from 'src/database/database.module'
import { TasksController } from './tasks.controller'
import { TasksService } from './tasks.service'
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
    controllers: [TasksController],
    providers: [TasksService],
})
export class TasksModule {}
