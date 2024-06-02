from fastapi import APIRouter, HTTPException, Response, Request, status
from pydantic import BaseModel
from database.db_core import session
from database.models import User, Project, Backlog, TaskList, Task
from sqlalchemy import select, Table
from sqlalchemy.orm import selectinload
from shemas import TasksDTO, TasksDTOorm, UserDTO, UserDTOorm, ChangeStatusTaskDTO

router = APIRouter(
    tags=['tasks']
)

# class TasksDTO(BaseModel):
#     name: str
#     description: str
#     appointment_date: str
#     creator_id: int
#     executor_id: int | None = None
#     status_id: int
#     tasks_list_id: int
#
#
# class TasksDTOorm(TasksDTO):
#     id: int
#
#
# class UserDTO(BaseModel):
#     login: str
#     password: str
#
# class UserDTOorm(UserDTO):
#     id: int
#     name: str
#     surname: str
#
# class ChangeStatusTaskDTO(BaseModel):
#     status_id: int
#     executor_id: int

@router.get('/tasks/{tasks_list_id}')
async def get_tasks_by_list_id(tasks_list_id: int) -> list[TasksDTOorm]:
    with session() as s:
        tasks = s.query(Task).where(Task.tasks_list_id == tasks_list_id).all()
        result = [TasksDTOorm.model_validate(row, from_attributes=True) for row in tasks]
        print(result)
        return result


@router.post('/tasks/create')
async def create_task(body: TasksDTO):
    print(body)
    with session() as s:
        task = Task(
            name=body.name,
            description=body.description,
            appointment_date=body.appointment_date,
            expected_date=body.expected_date,
            tasks_list_id=body.tasks_list_id,
            creator_id=body.creator_id,
            executor_id=body.executor_id,
            status_id=body.status_id
        )
        s.add(task)
        s.commit()
        return


@router.get('/task/{task_id}/delete')
async def delete_task_by_id(task_id: int):
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        s.delete(task)
        s.commit()
        return

@router.post('/task/{task_id}/changeStatus')
async def change_status_task_by_id(task_id: int, body: ChangeStatusTaskDTO):
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        task.status_id = body.status_id
        task.executor_id = body.executor_id
        s.commit()
        return

@router.post('/task/{task_id}/edit')
async def edit_task_by_id(task_id: int, body: TasksDTO):
    #пока меняю только описание и название задачи, хз как пройтись по всем атрибутам объекта
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        task.name = body.name
        task.description = body.description
        task.expected_date = body.expected_date
        s.commit()
        return


@router.post('/task/{task_id}/take')
async def take_task(task_id: int, req: Request):
    user_id = req.headers.get('user_id')
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        task.executor_id = int(user_id)
        s.commit()
        return

@router.get('/tasks/{task_id}/get-user')
async def take_task(task_id: int, req: Request) -> UserDTOorm | None:
    # user_id = req.headers.get('user_id')
    with session() as s:
        task = s.get(Task, task_id)
        if(task == None or task.executor_id == None):
            return None

        user_id = int(task.executor_id)
        user = s.get(User, user_id)
        result = UserDTOorm.model_validate(user, from_attributes=True)
        print(result)
        return result

