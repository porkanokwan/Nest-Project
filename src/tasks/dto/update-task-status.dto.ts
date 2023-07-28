import { TaskStatus } from '../tsaks.interface'
import { IsEnum } from 'class-validator'

export class UpdateTaskStatusDTO {
    @IsEnum(TaskStatus)
    status: TaskStatus
}
