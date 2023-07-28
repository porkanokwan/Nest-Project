export type Task = {
    id: string
    title: string
    description: string
    status: TaskStatus
}

export enum TaskStatus {
    OPEN = 'OPEN',
    DOING = 'DOING',
    DONE = 'DONE',
}
