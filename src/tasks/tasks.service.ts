import { Injectable, NotFoundException } from '@nestjs/common'
import { Task } from './tsaks.interface'
import { TaskStatus } from './tsaks.interface'
import { v4 as uuid } from 'uuid'
import { CreateTaskDTO } from 'src/tasks/dto/create-task.dto'
import { GetTaskFilterDTO } from './dto/get-task-filter.dto'
import { DatabaseService } from 'src/database/database.service'
import * as mssql from 'mssql'

@Injectable()
// รับ parameter แล้ว return result
export class TasksService {
    constructor(private databaseService: DatabaseService) {}
    // Mockup db
    // private tasks: Task[] = [
    //     {
    //         id: '1',
    //         title: 'cooking',
    //         description: 'curry',
    //         status: TaskStatus.DONE,
    //     },
    // ]

    async getAllTask() {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        // ต้องทำ Type ให้ execute เสมอ และใน () ใส่ชื่อ store
        const { recordset } = await request.execute<Task>('SP_GET_ALL_PRODUCT')
        return recordset
    }

    async createTask(
        // Non DTO
        // title: string, description: string

        // DTO
        createTaskDTO: CreateTaskDTO,
    ) {
        const { title, description } = createTaskDTO

        const pool = this.databaseService.getPool()
        const request = pool.request()
        // การสร้าง parameter ควรกำหนด Type เพื่อกัน Error ของเราเอง
        request.input('id', mssql.NVarChar, uuid())
        request.input('title', mssql.NVarChar, title)
        request.input('description', mssql.NVarChar, description)
        request.input('status', mssql.NVarChar, TaskStatus.OPEN)

        const { recordset } = await request.execute<Task>('dbo.sp_create_task')
        return recordset[0]
    }

    async getTaskById(id: string) {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('id', mssql.NVarChar, id)

        const {
            recordset: [task],
        } = await request.execute<Task>('dbo.sp_get_task_by_id')

        if (!task) {
            // เวลาจะ throw error ให้ใช้ built in exception พอ throw ออกไป Exception filter จะทำงานเอง
            throw new NotFoundException() // return statusCode, message
        }
        return task
    }

    async deleteTask(id: string) {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('id', mssql.NVarChar, id)

        const result = await request.execute<Task>('dbo.sp_delete_task')

        if (result.rowsAffected[0] === 0) {
            throw new NotFoundException(`${id} not found`)
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus) {
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('id', mssql.NVarChar, id)
        request.input('status', mssql.NVarChar, status)

        const {
            recordset: [task],
        } = await request.execute<Task>('dbo.sp_update_task_status')
        return task
    }

    async getTaskWithFilters(filterDTO: GetTaskFilterDTO) {
        const { status, keyword } = filterDTO
        const pool = this.databaseService.getPool()
        const request = pool.request()
        request.input('status', mssql.NVarChar, status)
        request.input('keyword', mssql.NVarChar, keyword)

        const { recordset } = await request.execute<Task>(
            'dbo.sp_get_task_by_filter',
        )
        return recordset[0]
    }
}
