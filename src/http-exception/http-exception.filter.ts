import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import * as winston from 'winston'
import 'winston-daily-rotate-file'

// เก็บ Log ไว้อ่านใข้ winston เพื่อให้มัน write file ให้เรา
const transports = new winston.transports.DailyRotateFile({
    filename: './logs/error.log',
    json: true,
    maxFiles: '30d',
})
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [transports], // การกำหนดว่าจะ write file ลง file ไหน
})

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        console.log('exception run')

        // Custom exception filter เพราะ จะเก็บ log ตรงนี้เลย ว่าถ้าเกิด error ใน app exception จะมา run ตรงนี้ เลยมาเก็บ log ที่นี่
        const request = host.switchToHttp().getRequest<Request>() // เอาไป write log เพื่อเก็บไว้ดู
        const response = host.switchToHttp().getResponse<Response>() // เอาไป write log เพื่อเก็บไว้ดู

        // exception คือ exception ที่ throw ออกมาใน service
        // ต้อง check ก่อนว่ามี throw error จาก exception ไหม ถ้ามี getStatus ถึงจะมีค่าออกมา ถ้าไม่มีให้ตั้ง default
        const status =
            exception instanceof HttpException ? exception.getStatus() : 500
        const message = exception.message // ข้อความที่ใส่ไปตอนใช้ exception

        // เรียกใช้ logger
        const logData = {
            statusCode: status,
            message,
            timeStamp: new Date().toLocaleDateString(),
            path: request.url,
        }
        logger.error(logData)

        // สร้าง response ใหม่ที่จะ return ออกไปแทนตัวเก่า ดังนั้น ตอนนี้พอเวลามี error ที่ throw exception ออกมา เราจะได้ค่าตามแบบข้างล่าง
        response.status(status).json({
            statusCode: status,
            message,
            timeStamp: new Date().toLocaleDateString(),
            path: request.url,
        })
    }
}
