from database.db_core import session
from database.models import User, Project, ProjectsUsers, Backlog, ColorStatus, StatusTask, Task
from shemas import TasksDTO


def get_tasks_by_tasks_list_id(tasks_list_id: int):
    with session() as s:
        tasks = s.query(Task).where(Task.tasks_list_id == tasks_list_id).all()
        return tasks


def create_task(data: TasksDTO):
    print(data)
    with session() as s:
        task = Task(
            name=data.name,
            description=data.description,
            appointment_date=data.appointment_date,
            expected_date=data.expected_date,
            tasks_list_id=data.tasks_list_id,
            creator_id=data.creator_id,
            executor_id=data.executor_id,
            status_id=data.status_id
        )
        s.add(task)
        s.commit()
        return

def delete_task(task_id: int):
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        s.delete(task)
        s.commit()
        return

def change_status_task(task_id: int, status_id: int):
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        task.status_id = status_id
        s.commit()
        return

def add_task_executor(task_id: int, executor_id: int):
    with session() as s:
        task = s.query(Task).where(Task.id == task_id).first()
        task.executor_id = executor_id
        s.commit()
        return
