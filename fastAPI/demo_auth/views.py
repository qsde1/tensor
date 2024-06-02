import uuid
from typing import Annotated
from pydantic import  BaseModel
from fastapi import APIRouter, Depends, Header, HTTPException, status, Request, Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials

router = APIRouter(prefix='/demo-auth', tags=['demo auth'])

security = HTTPBasic()

@router.get('/basic-auth')
def demo_basic_auth_credentials(
        credentials: Annotated[HTTPBasicCredentials, Depends(security)],
):
    return {
        'msg': 'work',
        'username': credentials.username,
        'password': credentials.password,
    }


static_auth_token = {
    '123123': 'admin',
}

def get_username_by_token(
    req: Request
) -> str:
    static_token = req.headers.get('static_token')
    if static_token == None or static_token not in static_auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='token invalid',
        )
    return static_auth_token.get(static_token)



@router.get('/some-header-auth')
def demo_auth_some_header(username: str = Depends(get_username_by_token)) -> str:
    return username


bd = {
    'qwe': '123'
}


class Body(BaseModel):
    login: str
    password: str

@router.post('/login')
def login(
        res: Response,
        body: Body
):
    if body.login not in bd or bd[body.login] != body.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='token invalid',
        )

    res.set_cookie('u_id', uuid.uuid4().hex, samesite='none', secure=True)
    return {'result': 'ok'}



