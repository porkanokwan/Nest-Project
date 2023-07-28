import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
// import { HttpExceptionFilter } from './http-exception/http-exception.filter'
// import { AuthGuard } from './auth/auth/auth.guard'
import { setupSwagger } from './swagger'

async function bootstrap() {
    // console.log(process.env.NODE_ENV) // dev เพราะ ใน file package.json เรา set NODE_ENV=dev

    const app = await NestFactory.create(AppModule)
    // ใส่ Middleware Pipes
    app.useGlobalPipes(new ValidationPipe())

    // เรียกใช้ Exception แบบ Global แต่ใน main มันอยู่นอก Module เวลาเรียกเลยต้องใช้ new ใช้ inject ไม่ได้
    // app.useGlobalFilters(new HttpExceptionFilter())

    //ใช้วิธีนี้ได้เมื่อ Guard (ในนี้หมายถึง AuthGuard) ไม่มี injection เพราะ main มันอยู่นอก Module เวลาเรียกเลยต้องใช้ new แทน
    // app.useGlobalGuards(new AuthGuard())

    // set origin ที่อนุญาตให้ใช้ข้ามได้
    app.enableCors({ origin: '*' })

    // config swagger
    setupSwagger(app)

    await app.listen(process.env.DB_PORT)
}

bootstrap()
