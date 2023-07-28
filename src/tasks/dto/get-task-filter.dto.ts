import { TaskStatus } from '../tsaks.interface'
import { IsEnum, IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetTaskFilterDTO {
    @ApiProperty({
        enum: TaskStatus,
        description: 'status ของ task',
        required: false,
    })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus

    @ApiProperty({
        description: 'คำค้นหา',
        required: false,
    })
    @IsOptional()
    @IsString()
    keyword?: string
}
