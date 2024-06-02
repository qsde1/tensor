from fastapi import APIRouter, HTTPException, Response, Request, status, Depends, WebSocket
from services import jwt_auth, task_lists_service
from pydantic import BaseModel
from database.db_core import session
from database.models import User, Project, Backlog
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from shemas import Payload, TaskListDTOToCreate

router = APIRouter(
    tags=['backlogs']
)

class BacklogDTO(BaseModel):
    id: int
    project_id: int



@router.get('/backlog/{project_id}')
async def get_backlog(
    project_id: int,
    payload: Payload | None = Depends(jwt_auth.validate_token)
) -> BacklogDTO | None:
    with session() as s:
        backlog = s.query(Backlog).where(Backlog.project_id == project_id).first()
        result = BacklogDTO.model_validate(backlog, from_attributes=True)
        print(result)
        return result

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list[int,WebSocket] = {}
        print("Creating a list backlog sockets: ",self.active_connections)

    async def connect(self, backlog_id: str, websocket: WebSocket):
        await websocket.accept()
        if not self.active_connections.get(backlog_id):
            self.active_connections[backlog_id] = []
        self.active_connections[backlog_id].append(websocket)
        print("backlog sockets: ",self.active_connections)

    async def disconnect(self, backlog_id: str, websocket: WebSocket):
        self.active_connections[backlog_id].remove(websocket)
        print("backlog sockets: ",self.active_connections)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        print("Sent a personal msg to , ",websocket)

    async def broadcast(self, data, backlog_id: str):
        for connection in self.active_connections[backlog_id]:
            await connection.send_json(data)


manager = ConnectionManager()

@router.websocket('/ws/{token}/backlog/{backlog_id}/tasks-lists')
async def ws_task(
        ws: WebSocket,
        backlog_id: int
):
    await manager.connect(backlog_id, ws)
    try:
        while True:
            res = await ws.receive_json()
            action = res.get('action')
            match action:
                case 'get-task-lists-by-backlog-id':
                    task_lists = task_lists_service.get_task_lists_by_backlog_id(backlog_id)
                    # result_dto = [TaskListDTOorm.model_validate(row, from_attributes=True) for row in task_lists]
                    result = [task.as_dict() for task in task_lists]
                    await ws.send_json({
                        'action': 'return-task-lists',
                        'data': result
                    })
                case 'create-task-list':
                    try:
                        task_list = TaskListDTOToCreate.model_validate(res.get('data'), from_attributes=True)
                        task_lists_service.create_task_list(task_list)
                        await manager.broadcast(
                            {
                            'action': 'task-list-addet'
                            },
                            backlog_id=backlog_id
                        )
                        # await ws.send_json({
                        #
                        # })
                    except Exception as e:
                        await ws.send_json({
                            'action': 'exception',
                            'data': str(e)
                        })


    except Exception as e:
        print("Got an exception ", e)
        await manager.disconnect(backlog_id, ws)

