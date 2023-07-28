import { Controller, Get, Logger } from '@nestjs/common'
import {
    Body,
    Delete,
    Param,
    Post,
    Put,
    UseFilters,
    UseGuards,
} from '@nestjs/common/decorators'
import { Query } from '@nestjs/common/decorators/http/route-params.decorator'
import { ApiTags } from '@nestjs/swagger/dist'
import {
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger'
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto'
import { GetTaskFilterDTO } from './dto/get-task-filter.dto'
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto'
import { GetAllTaskResponse } from './response/get-all-task-response'
import { TasksService } from './tasks.service'
import { AuthGuard } from 'src/auth/auth/auth.guard'
import { HttpExceptionFilter } from 'src/http-exception/http-exception.filter'

// กำหนดชื่อหัวข้อใน Docs
@ApiTags('Tasks')
// path ใน url
@Controller('tasks')
// handle request/response to client (1 layer รับ parameter)
export class TasksController {
    // TasksService เป็น dependency ของ TasksController ถ้า TasksController ขาด TasksService จะทำงานไม่ได้ ต้องใช้วิธี Dependency Injection
    // สามารถใส่ค่าอะไรก็ได้เข้าแทน TasksService ถ้าใช้ new จะทำไม่ได้
    constructor(private taskService: TasksService) {
        // this.taskService = new TasksService()
        // this.taskService.getAllTask()
    }

    // การกำหนด logger
    private readonly logger = new Logger('task')

    // เรียกใช้ Exception ผ่านทาง UseFilters ถ้าเขียนแบบนี้จะต้องใส่ในทุกๆ endpoint ใน controller
    @UseFilters(HttpExceptionFilter)
    // เรียกใช้ Guard ผ่านทาง UseGuards ถ้าเขียนแบบนี้จะต้องใส่ในทุกๆ controller (แนะนำวิธีนี้)
    @UseGuards(AuthGuard)
    @Get('/') // Decorator จะใช้ครอบ function ที่ต้องการเรียกใช้
    // เป็นตัวบอกว่า จะมี parameter อะไรออกไปบ้าง
    @ApiOkResponse({
        description: 'สำเร็จ',
        type: [GetAllTaskResponse],
    })
    @ApiUnauthorizedResponse({ description: 'ต้องมี token' })
    @ApiBadRequestResponse({ description: 'Parameter ไม่ครบ' })
    getAllTask(@Query() query: GetTaskFilterDTO) {
        // เรียกใช้ logger
        this.logger.log('log')
        this.logger.error('error')
        this.logger.warn('warn')
        this.logger.debug('debug')
        this.logger.verbose('verbose') // monitor ว่าเราเรียกอันนี้มั้ย

        if (Object.keys(query).length) {
            return this.taskService.getTaskWithFilters(query)
        }
        return this.taskService.getAllTask()
    }

    @UseGuards(AuthGuard)
    @Post()
    createTask(
        // Non DTO
        // @Body('title') title: string,
        // @Body('description') description: string,

        // DTO
        @Body() createTaskDTO: CreateTaskDTO,
    ) {
        return this.taskService.createTask(createTaskDTO)
    }

    @Get('/:taskID')
    getTaskById(@Param('taskID') taskId: string) {
        this.logger.verbose(`get task by ${taskId} was called`)
        return this.taskService.getTaskById(taskId)
    }

    @Delete('/:taskID')
    deleteTask(@Param('taskID') taskID: string) {
        return this.taskService.deleteTask(taskID)
    }

    @Put('/:taskID/status') // ถ้า taskID ไม่ required ใช้ Query ดีกว่า หรือถ้าใช้ในการ search ให้ใช้ Query
    updateTaskStatus(
        @Param('taskID') taskID: string,
        @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
    ) {
        const { status } = updateTaskStatusDTO
        return this.taskService.updateTaskStatus(taskID, status)
    }
}
