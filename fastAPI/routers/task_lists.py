from fastapi import APIRouter, HTTPException, Response, Request, status, Depends, WebSocket
from services import jwt_auth, task_lists_service, tasks_service
from shemas import Payload, TasksDTO
from pydantic import BaseModel
from database.db_core import session
from database.models import User, Project, Backlog, TaskList
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from shemas import TaskListDTOorm, TaskListDTOToCreate

router = APIRouter(
    tags=['task_lists']
)


# class TaskListDTOToCreate(BaseModel):
#     name: str
#     backlog_id: int
#
#
# class TaskListDTOorm(TaskListDTOToCreate):
#     id: int


@router.get('/task-lists/{backlog_id}')
async def get_task_lists_by_backlog_id(
        backlog_id: int,
        payload: Payload | None = Depends(jwt_auth.validate_token)
) -> list[TaskListDTOorm]:
    with session() as s:
        task_lists = s.query(TaskList).where(TaskList.backlog_id == backlog_id).all()
        result_dto = [TaskListDTOorm.model_validate(row, from_attributes=True) for row in task_lists]
        print(result_dto)
        return result_dto


@router.post('/task-lists')
async def create_task_list(body: TaskListDTOToCreate):
    with session() as s:
        task_list = TaskList(name=body.name, backlog_id=body.backlog_id)
        s.add(task_list)
        s.commit()
        return


@router.get('/tasks-list/{tasks_list_id}')
async def get_tasks_list_by_id(tasks_list_id: int) -> TaskListDTOorm:
    with session() as s:
        task_list = s.query(TaskList).where(TaskList.id == tasks_list_id).first()
        result = TaskListDTOorm.model_validate(task_list, from_attributes=True)
        print(result)
        return result


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list[int,WebSocket] = {}
        print("Creating a list task-list sockets: ",self.active_connections)

    async def connect(self, task_list_id: int, websocket: WebSocket):
        await websocket.accept()
        if not self.active_connections.get(task_list_id):
            self.active_connections[task_list_id] = []
        self.active_connections[task_list_id].append(websocket)
        print("task-list sockets: ",self.active_connections)

    async def disconnect(self, task_list_id: int, websocket: WebSocket):
        self.active_connections[task_list_id].remove(websocket)
        print("task-list sockets: ",self.active_connections)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        print("Sent a personal msg to , ",websocket)

    async def broadcast(self, data, task_list_id: int):
        for connection in self.active_connections[task_list_id]:
            await connection.send_json(data)


manager = ConnectionManager()

@router.websocket('/ws/{token}/task-list/{tasks_list_id}')
async def ws_task(
        ws: WebSocket,
        tasks_list_id: int
):
    await manager.connect(tasks_list_id, ws)
    try:
        while True:
            res = await ws.receive_json()
            action = res.get('action')
            match action:
                case 'get-task-list':
                    task_list = task_lists_service.get_task_list_by_id(tasks_list_id)
                    result = task_list.as_dict()
                    await ws.send_json({
                        'action': 'return-task-list',
                        'data': result
                    })
                case 'get-tasks':
                    tasks = tasks_service.get_tasks_by_tasks_list_id(tasks_list_id)
                    result = [task.as_dict() for task in tasks]
                    await ws.send_json({
                        'action': 'return-tasks',
                        'data': result
                    })
                case 'create-task':
                    task = TasksDTO.model_validate(res.get('data'), from_attributes=True)
                    tasks_service.create_task(task)
                    await manager.broadcast(
                        {'action': 'task-created'},
                        tasks_list_id
                    )
                case 'delete-task':
                    task_id = res.get('data').get('taskId')
                    tasks_service.delete_task(task_id)
                    await manager.broadcast(
                        {'action': 'task-deleted'},
                        tasks_list_id
                    )
                case 'add-task-executor':
                    task_id = res.get('data').get('taskId')
                    executor_id = res.get('data').get('executorId')
                    tasks_service.add_task_executor(task_id, executor_id)
                    await manager.broadcast(
                        {'action': 'executor-addet'},
                        tasks_list_id
                    )
                case 'change-status-task':
                    task_id = res.get('data').get('taskId')
                    status_id = res.get('data').get('statusId')
                    tasks_service.change_status_task(task_id, status_id)
                    await manager.broadcast(
                        {'action': 'status-task-changed'},
                        tasks_list_id
                    )
                case 'change-name-task':
                    data = res.get('data')
                    task_id = data.get('taskId')
                    name = data.get('name')
                    tasks_service.change_name_task(task_id, name)
                    await manager.broadcast(
                        {'action': 'task-name-changed'},
                        tasks_list_id
                    )
                case 'change-description-task':
                    data = res.get('data')
                    task_id = data.get('taskId')
                    description = data.get('description')
                    tasks_service.change_description_task(task_id, description)
                    await manager.broadcast(
                        {'action': 'task-description-changed'},
                        tasks_list_id
                    )


    except Exception as e:
        print("Got an exception ", e)
        await manager.disconnect(tasks_list_id, ws)