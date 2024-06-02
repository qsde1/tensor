from fastapi import APIRouter, HTTPException, Response, Request, status
from pydantic import BaseModel
from database.db_core import session
from database.models import User, Project, Backlog, TaskList, Task
from sqlalchemy import select, Table
from sqlalchemy.orm import selectinload
from shemas import UserDTO, UserDTOorm, Payload
from services import jwt_auth
from fastapi import Depends, HTTPException, status
import services.users as users_service

router = APIRouter(
    tags=['users']
)

# class UserDTO(BaseModel):
#     login: str
#     password: str
#
# class UserDTOorm(UserDTO):
#     id: int
#     name: str
#     surname: str

@router.get('/users/get-user-by-token')
async def get_user_by_token(payload: Payload = Depends(jwt_auth.validate_token)):
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='user not found'
        )

    user_id = int(payload.user_id)
    user = users_service.get_user_by_id(user_id)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='user not found'
        )

    return user




@router.get('/users/{user_id}')
async def get_user_by_id(user_id: int) -> UserDTOorm:
    with session() as s:
        user = s.query(User).where(User.id == user_id).first()
        result = UserDTOorm.model_validate(user, from_attributes=True)
        return result



