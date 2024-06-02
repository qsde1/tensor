from fastapi import APIRouter, HTTPException, Response, Request, status, Depends
from shemas import UserDTO, UserRegistration
from services import jwt_auth
from pydantic import BaseModel
from database.db_core import session
from database.models import User, Project, Backlog, TaskList, Task
from sqlalchemy import select, Table
from sqlalchemy.orm import selectinload
from shemas import UserDTO, UserDTOorm

router = APIRouter(
    tags=['auth'],
)

db = {
}


@router.post('/registration')
async def registration(user=Depends(jwt_auth.registration_user)):
    print(user)


@router.post('/auth')
async def auth(token=Depends(jwt_auth.validate_user)):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )
    return {'key': 'token', 'value': token}
    # if body.login not in db:
    #     return False
    # return jwt_auth.validate_password(body.password, db[body.login].password)

