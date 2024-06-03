from sqlalchemy import func
from sqlalchemy.orm import joinedload

from database.db_core import session
from database.models import User, Project, ProjectsUsers, Backlog, ColorStatus, StatusTask
from shemas import ProjectCreate, ProjectDTO


def create_project(proj:ProjectCreate):
    with session() as s:
        project = Project(name=proj.name, description=proj.description)
        s.add(project)
        s.flush()

        user = s.get(User, proj.creator_id)

        user.projects.append(project)
        backlog = Backlog(project_id=project.id)
        s.add(backlog)
        s.flush()

        projects_users = s.query(ProjectsUsers).where(
            ProjectsUsers.project_id == project.id and
            ProjectsUsers.user_id == proj.creator_id
        ).first()
        projects_users.role = 'creator'
        s.flush()

        green = s.query(ColorStatus).where(ColorStatus.name == 'green').first()
        red = s.query(ColorStatus).where(ColorStatus.name == 'red').first()
        purple = s.query(ColorStatus).where(ColorStatus.name == 'purple').first()

        status1 = StatusTask(name='не назначено', project_id=project.id, color_id=red.id, coefficient=1)
        status2 = StatusTask(name='в процессе', project_id=project.id, color_id=purple.id, coefficient=2)
        status3 = StatusTask(name='выполнено', project_id=project.id, color_id=green.id, coefficient=3)

        s.add(status1)
        s.add(status2)
        s.add(status3)
        s.commit()


def get_project_by_id(project_id: int):
    with session() as s:
        project = s.query(Project).where(Project.id == project_id).first()
        return project


def get_creator_project(project_id: int):
    with session() as s:
        # query = (
        #     select(ProjectsCreate)
        #     .where(ProjectsUsers.project_id == project_id and ProjectsUsers.role == 'creator')
        #     .options(selectinload(ProjectsUsers.users))
        #     .where(User.)
        #
        # )

        query = s.query(ProjectsUsers).where(ProjectsUsers.project_id == project_id).first()
        user = s.get(User, query.user_id)
        return user


def get_statuses_by_project_id(project_id: int):
    with session() as s:
        statuses = s.query(Project).where(Project.id == project_id).first().statuses
        return statuses


def get_user_role_by_user_id(user_id: int):
    with session() as s:
        proj_user = s.query(ProjectsUsers).where(ProjectsUsers.user_id == int(user_id)).first()
        role = proj_user.role
        return role

def get_colors():
    with session() as s:
        colors = s.query(ColorStatus).all()
        return colors

def get_project_users(project_id: int):
    with session() as s:
        project = s.query(Project).where(Project.id == project_id).options(joinedload(Project.users)).first()
        return project.users


def create_status(project_id, status_name: str, color_id: int):
    with session() as s:
        max_coefficient = s.query(func.max(StatusTask.coefficient)).scalar()
        status = StatusTask(
            name=status_name,
            coefficient=max_coefficient+1,
            color_id=color_id,
            project_id=project_id,
        )
        s.add(status)
        s.commit()
        return
        # status = StatusTask(name=status.name)

def swap_statuses(status_one_id, status_two_id):
    with session() as s:
        status_one = s.get(StatusTask, status_one_id)
        status_two = s.get(StatusTask, status_two_id)
        temp = status_one.coefficient
        status_one.coefficient = status_two.coefficient
        status_two.coefficient = temp
        s.commit()
        return

def delete_status(status_id):
    with session() as s:
        status = s.get(StatusTask,status_id)
        s.delete(status)
        s.commit()
        return