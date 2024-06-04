import json
from builtins import type

import psycopg.errors
from fastapi import APIRouter, HTTPException, Response, Request, status, responses, Depends, WebSocket
from pydantic import BaseModel
from sqlalchemy.exc import SQLAlchemyError

from database.db_core import session
from database.models import User, Project, Backlog, StatusTask, ColorStatus, ProjectsUsers, ProjectLinkInvite
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload, joinedload
from services import jwt_auth, projects_service
from shemas import ProjectCreate, ProjectDTO, StatusDTOCreate, StatusDTOorm, UserDTO, UserDTOorm, Payload, \
    ProjectCreateDTO
import string
import random

router = APIRouter(
    tags=['projects']
)


@router.get('/projects')
async def get_projects(
        payload: Payload = Depends(jwt_auth.validate_token)
) -> list[ProjectDTO] | None:
    user_id = payload.user_id
    with session() as s:
        query = (
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.projects))
        )

        result = s.execute(query).scalars().first()
        projects = result.projects
        result_dto = [ProjectDTO.model_validate(row, from_attributes=True) for row in projects]
        return result_dto

        # projects = s.query(Project).where(Project.creator_id == user_id).all()
        # result = []
        # for p in projects:
        #     result.append(p.as_dict())
        # return result

        # query = (
        #     select(User)
        # )
        # res = s.execute(query)
        # result = res.scalars().all()
        # projects = result[0].projects

        # https://www.youtube.com/watch?v=jiS2CmvPTfM&list=PLeLN0qH0-mCXARD_K-USF2wHctxzEVp40&index=11 - видос про эти загрузки(вложенные модели конвертируются в JSON)
        # неправильная загрузка
        # projects = s.query(User).where(User.id == user_id).first().projects

        # правильная загрузка
        # user = s.query(User).where(User.id == user_id).options(selectinload(User.projects)).first()

        # projects_user = s.query(ProjectsUsers).where(ProjectsUsers.user_id == user_id).options(selectinload(Project.projects_user)).first()
        # print(projects_user.as_dict())
        # projects_users = s.query(ProjectsUsers).where(ProjectsUsers.user_id == user_id).options(selectinload(ProjectsUsers.)).first()

        # projects = user.projects

        # print(projects)
        # # query = (
        # #     select(User, )
        # #     .options(selectinload(User.projects))
        # # )
        #
        # #это только для return(не модели для бд)!
        # result_dto = [ProjectDTO.model_validate(row, from_attributes=True) for row in projects]
        #
        # # for p in projects:
        # #     result.append(p.as_dict())
        # # print(projects[0].name)
        # print(result_dto)
        # return result_dto

@router.post('/projects/create')
async def project_create(body: ProjectCreateDTO, payload: Payload | None = Depends(jwt_auth.validate_token)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='вы не авторизованны для данного ресурса'
        )

    project_obj = {
        'name': body.name,
        'description': body.description,
        'creator_id': payload.user_id
    }
    projects_service.create_project(ProjectCreate.model_validate(project_obj, from_attributes=True))
    # with session() as s:
    #     # project = Project(name=body.name, creator_id=body.creator_id)
    #     # s.add(project)
    #     # s.flush()
    #     # backlog = Backlog(project_id=project.id)
    #     # s.add(backlog)
    #     # s.flush()
    #
    #     project = Project(name=body.name, description=body.description)
    #     s.add(project)
    #     s.flush()
    #
    #     user = s.get(User, body.creator_id)
    #
    #     user.projects.append(project)
    #     backlog = Backlog(project_id=project.id)
    #     s.add(backlog)
    #     s.flush()
    #
    #     projects_users = s.query(ProjectsUsers).where(
    #         ProjectsUsers.project_id == project.id and
    #         ProjectsUsers.user_id == body.creator_id
    #     ).first()
    #     projects_users.role = 'creator'
    #     s.flush()
    #
    #     #
    #     # project_user = ProjectsUsers(project_id=project.id, user_id=body.creator_id, role='creator')
    #     # s.add(project_user)
    #     # s.flush()
    #
    #
    #
    #     green = s.query(ColorStatus).where(ColorStatus.name == 'green').first()
    #     red = s.query(ColorStatus).where(ColorStatus.name == 'red').first()
    #     purple = s.query(ColorStatus).where(ColorStatus.name == 'purple').first()
    #
    #     status1 = StatusTask(name='не назначено', project_id=project.id, is_first=True, color_id=red.id)
    #     status2 = StatusTask(name='в процессе', project_id=project.id, color_id=purple.id)
    #     status3 = StatusTask(name='выполнено', project_id=project.id, color_id=green.id)
    #
    #     s.add(status1)
    #     s.add(status2)
    #     s.add(status3)
    #     s.commit()

    # return True


@router.get('/project/{project_id}')
async def get_project(
        project_id: int,
        payload: Payload | None = Depends(jwt_auth.validate_token)
):
    with session() as s:
        project = s.query(Project).where(Project.id == project_id).first()
        result = ProjectDTO.model_validate(project, from_attributes=True)
        return result

@router.get('/project/{project_id}/delete')
async def project_delete(project_id: int):
    print(project_id)
    with session() as s:
        project = s.query(Project).where(Project.id == project_id).first()
        print(project)
        # project.name = 'edited project'
        s.delete(project)
        s.commit()
        return


@router.get('/project/{project_id}/statuses')
async def get_statuses_by_project_id(project_id: int) -> list[StatusDTOorm]:
    with session() as s:
        statuses = s.query(Project).where(Project.id == project_id).first().statuses
        result = [StatusDTOorm.model_validate(row, from_attributes=True) for row in statuses]
        return result


@router.get('/project/{project_id}/get-creator')
async def get_project_creator(
        project_id: int,
        payload: Payload | None = Depends(jwt_auth.validate_token)
) -> UserDTOorm:
    with session() as s:
        # query = (
        #     select(ProjectsCreate)
        #     .where(ProjectsUsers.project_id == project_id and ProjectsUsers.role == 'creator')
        #     .options(selectinload(ProjectsUsers.users))
        #     .where(User.)
        #
        # )

        query = s.query(ProjectsUsers).join(
            User,
            and_(ProjectsUsers.project_id == project_id, ProjectsUsers.role == 'creator')
        ).first()
        user = s.get(User, query.user_id)
        result = UserDTOorm.model_validate(user, from_attributes=True)
        return result





        #это потом раскоментить
        # res = s.query(ProjectsUsers).where(ProjectsUsers.project_id == project_id and ProjectsUsers.role == 'creator').first()
        # user = s.get(User, res.user_id)
        # result = UserDTOorm.model_validate(user, from_attributes=True)
        # return result

        # query = select(User).\
        #             where(and_(
        #                 Project.id == project_id,
        #                 ProjectsUsers.role == 'creator'
        #             ))
        #
        # result = s.execute(query).scalars().all()
        # print(result)



        # result = s.execute(query).scalars().first()
        # projects = result.projects
        # result_dto = [ProjectDTO.model_validate(row, from_attributes=True) for row in projects]
        # return result_dto


@router.get('/project/{project_id}/users')
async def get_project_users(project_id: int) -> list[UserDTO]:
    with session() as s:

        # query = s.query(User, Project, ProjectsUsers).where(Project.id == project_id).all()
        # print(query)
        # return []
        query = (
            select(Project)
            .where(Project.id == project_id)
            .options(selectinload(Project.users))
        )

        project = s.execute(query).scalars().first()
        result = [UserDTO.model_validate(row, from_attributes=True) for row in project.users]
        return result


@router.get('/project/{project_id}/link-invite')
async def get_project_link_invite(project_id: int) -> str:
    with session() as s:
        link = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10))
        link_proj = ProjectLinkInvite(project_id = project_id, link=link)
        s.add(link_proj)
        s.commit()
        return link


@router.get('/projects/join/{link_invite}')
async def join_to_project(link_invite: str):
    return responses.RedirectResponse('ttps://tensor-5ha6.onrender.com/projects/join/' + link_invite)


@router.get('/projects/join/{link_invite}/add-user-to-project')
async def add_user_to_project(
        link_invite: str, req: Request,
        payload: Payload | None = Depends(jwt_auth.validate_token)

):
    user_id = payload.user_id
    if(user_id == None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="unauthorized",
        )
    with session() as s:
        user = s.get(User, user_id)
        link_db = s.query(ProjectLinkInvite).where(ProjectLinkInvite.link == link_invite).first()

        if(link_db == None):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="ссылка не найдена",
            )

        project = s.get(Project, link_db.project_id)
        await manager.broadcast(
            {
                'action': 'user-addet'
            },
            link_db.project_id,
        )
        project.users.append(user)
        s.flush()
        # projects_users = s.query(ProjectsUsers).where(
        #     ProjectsUsers.project_id == project.id and ProjectsUsers.user_id == user_id).first()
        # projects_users.role = 'user'
        s.delete(link_db)
        s.commit()
        return True


@router.get('/project/{project_id}/get-user-role')
async def get_user_role(
    project_id: int, req: Request,
    payload: Payload | None = Depends(jwt_auth.validate_token),
) -> str:
    user_id = payload.user_id
    with session() as s:
        proj_user = s.query(ProjectsUsers).where(ProjectsUsers.user_id == int(user_id)).first()
        role = proj_user.role
        return role


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: list[int,WebSocket] = {}
        print("Creating a list project sockets: ",self.active_connections)

    async def connect(self, project_id: int, websocket: WebSocket):
        await websocket.accept()
        if not self.active_connections.get(project_id):
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)
        print("project sockets: ",self.active_connections)

    async def disconnect(self, project_id: int, websocket: WebSocket):
        self.active_connections[project_id].remove(websocket)
        print("project sockets: ",self.active_connections)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
        print("Sent a personal msg to , ",websocket)

    async def broadcast(self, data, project_id: int):
        for connection in self.active_connections[project_id]:
            await connection.send_json(data)


manager = ConnectionManager()

@router.websocket('/ws/{token}/project/{project_id}')
async def ws_task(
        ws: WebSocket,
        project_id: int,
        token: str
):
    await manager.connect(project_id, ws)
    try:
        while True:
            res = await ws.receive_json()
            action = res.get('action')
            match action:
                case 'get-project':
                    project = projects_service.get_project_by_id(project_id)
                    result = project.as_dict()
                    await ws.send_json({
                        'action': 'return-project',
                        'data': result
                    })
                case 'get-creator':
                    user = projects_service.get_creator_project(project_id)
                    result = user.as_dict()
                    result['password'] = result['password'].decode()
                    await ws.send_json({
                        'action': 'return-creator',
                        'data': result
                    })
                case 'get-users':
                    users = projects_service.get_project_users(project_id)
                    result = [user.as_dict() for user in users]
                    for user in result:
                        user['password'] = user['password'].decode()
                    print(result)
                    await ws.send_json({
                        'action': 'return-users',
                        'data': result
                    })
                case 'get-statuses':
                    statuses = projects_service.get_statuses_by_project_id(project_id)
                    result = [status.as_dict() for status in statuses]
                    await ws.send_json({
                        'action': 'return-statuses',
                        'data': result
                    })
                case 'get-current-user-role':
                    payload = jwt_auth.validate_token_ws(token)
                    role = projects_service.get_user_role_by_user_id(payload.user_id)
                    await ws.send_json({
                        'action': 'return-current-user-role',
                        'data': role
                    })
                case 'get-colors':
                    colors = projects_service.get_colors()
                    result = [color.as_dict() for color in colors]
                    await ws.send_json({
                        'action': 'return-colors',
                        'data': result
                    })
                case 'create-status':
                    data = res.get('data')
                    status_name = data.get('statusName')
                    color_id = data.get('colorId')
                    projects_service.create_status(project_id,status_name, color_id)
                    await manager.broadcast(
                        {
                            'action': 'statuses-changed'
                        },
                        project_id,
                    )
                    # await ws.send_json({
                    #     'action': 'statuses-changed'
                    # })
                case 'swap-statuses':
                    data = res.get('data')
                    status_one_id = data.get('statusOneId')
                    status_two_id = data.get('statusTwoId')
                    projects_service.swap_statuses(status_one_id, status_two_id)
                    await manager.broadcast(
                        {
                            'action': 'statuses-changed'
                        },
                        project_id,
                    )
                    # await ws.send_json({
                    #     'action': 'statuses-changed'
                    # })
                case 'delete-status':
                    data = res.get('data')
                    status_id = data.get('statusId')
                    try:
                        projects_service.delete_status(status_id)
                    except SQLAlchemyError as e:
                        await ws.send_json({
                            'action': 'exception',
                            'data': {'msg': 'Нельзя удалить статус, на который ссылаются задачи'}
                        })
                    await manager.broadcast(
                        {
                            'action': 'statuses-changed'
                        },
                        project_id,
                    )
                    # await ws.send_json({
                    #     'action': 'statuses-changed'
                    # })

    except Exception as e:
        print("Got an exception ", e)
        await manager.disconnect(project_id, ws)