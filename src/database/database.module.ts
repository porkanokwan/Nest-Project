import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config/dist/config.module'
import { DatabaseService } from './database.service'

@Module({
    imports: [ConfigModule],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
