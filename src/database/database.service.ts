import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config/dist'
import { ConnectionPool } from 'mssql'

@Injectable()
// implements จะเหมือน interface พอเรา implement มาจะต้องเขียนรูปแบบให้เหมือนกับตัวที่ใส่มา
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: ConnectionPool = null
    private logger = new Logger('database')

    constructor(private configService: ConfigService) {}

    async onModuleInit() {
        console.log(this.configService.get('DB_HOST')) // 10.254.7.29
        const config = {
            user: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSWORD'),
            server: this.configService.get('DB_HOST'),
            database: this.configService.get('DB_DATABASE'),
            options: {
                encrypt: false,
            },
        }
        this.pool = new ConnectionPool(config)
        await this.pool.connect()

        // ดัก error
        this.pool.on('error', (err) => {
            this.logger.error(err)
        })
    }

    async onModuleDestroy() {
        if (this.pool) {
            await this.pool.close()
            this.pool = null
        }
    }

    getPool() {
        return this.pool
    }
}
