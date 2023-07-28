import { TaskStatus } from '../tsaks.interface'
import { ApiProperty } from '@nestjs/swagger'
import { v4 as uuid } from 'uuid'

export class GetAllTaskResponse {
    @ApiProperty({ description: 'ไอดี', example: uuid() })
    id: string
    @ApiProperty({ description: 'name of task', example: 'cooking' })
    title: string
    @ApiProperty({ description: 'explain', example: 'curry' })
    description: string
    @ApiProperty({ description: 'status', example: 'DONE' })
    status: TaskStatus
}
