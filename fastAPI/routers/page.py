from fastapi import APIRouter, HTTPException, Response, status, Cookie, Request
from pydantic import BaseModel
from database.db_core import session
from database.models import User
from typing import Annotated
from database.db_core import create_tables
from sqlalchemy import select



router = APIRouter(
    tags=['page']
)

class LoginUserForm(BaseModel):
    login: str
    password: str


class RegisterUserForm(LoginUserForm):
    name: str
    surname: str
    img: str

#
# @router.post('/registration')
# async def registration(form: RegisterUserForm):
#     with session() as s:
#         user = User(login=form.login, password=form.password, name=form.name, surname=form.surname, img=form.img)
#         s.add(user)
#         s.commit()


# @router.post('/auth')
# async def registration(form: LoginUserForm):
#     with session() as s:
#         # user = s.get(User, )
#         # query = select(User).where(User.login == form.login)
#         user = s.query(User).where(User.login == form.login).first()
#
#         if(user == None or user.password != form.password):
#             raise HTTPException(
#                 status_code=status.HTTP_404_NOT_FOUND,
#                 detail="неправильный логин или пароль",
#             )
#
#         return {'key': 'user_id', 'value': user.id}


class CookieForm(BaseModel):
    userId: int

@router.get('/check-user')
async def check_user(request: Request):
    token = request.headers.get('cookie_token')
    if(token == None):
        raise HTTPException(
             status_code=status.HTTP_404_NOT_FOUND,
             detail="invalid token",
        )
    print(token)
    # with session() as s:
    #     user = s.query(User).where(User.id == int(user_id)).first()
    #     if(user == None):
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND,
    #             detail="неправильный логин или пароль",
    #         )
    #     return {'msg' : 'пользователь с таким id еще существует'}


@router.get('/reset')
async def reset():
    create_tables()
    return


@router.get('/all-users')
async def get_all_users():
    with session() as s:
        # удаление пользователя
        # user = s.get(User, 4)
        # s.delete(user)
        # s.commit()
        query = select(User).where(User.id > 0)
        res = s.execute(query)
        result = res.all()
        print(type(result[0]))


