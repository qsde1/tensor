from database.db_core import session
from database.models import User, Project, ProjectsUsers, Backlog, ColorStatus, StatusTask, TaskList
from shemas import ProjectCreate
from shemas import TaskListDTOorm, TaskListDTOToCreate


def get_task_list_by_id(task_list_id: int):
    with session() as s:
        task_lists = s.get(TaskList,task_list_id)
        return task_lists

def get_task_lists_by_backlog_id(backlog_id: int):
    with session() as s:
        task_lists = s.query(TaskList).where(TaskList.backlog_id == backlog_id).all()
        return task_lists


def create_task_list(taskList):
    with session() as s:
        task_list = TaskList(name=taskList.name, backlog_id=taskList.backlog_id)
        s.add(task_list)
        s.commit()
        return