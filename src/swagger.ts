import { INestApplication } from '@nestjs/common'
import { SwaggerModule } from '@nestjs/swagger'
import { DocumentBuilder } from '@nestjs/swagger/dist'

export const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle('Task Management')
        .setDescription('NestJS Training')
        .addTag('Tasks', 'The Task management api') // ระบุ Tag ไว้ก่อน เพื่อที่พอไปตั้ง ApiTag ใน controller มันจะเป็นตัวบอกว่า ไปอยู่รวมกับ tag task ในนี้
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/', app, document)
}
