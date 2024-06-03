from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from routers.page import router as routerPage
from routers.projects import router as routerProjects
from routers.backlogs import router as routerBacklogs
from routers.task_lists import router as routerTaskLists
from routers.tasks import router as routerTasks
from routers.users import router as routerUsers
from routers.auth import router as routerAuth
from database.db_core import session
from database.models import ColorStatus
from services.s3_client import s3_client


#сбросить данные во всех таблицах

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex='.*',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", "Access-Control-Allow-Origin",
                   "Authorization", "Cookie_token", "Cookie"],
)


class ColorsDTOorm(BaseModel):
    id: int
    name: str


@app.get('/colors')
async def get_colors() -> list[ColorsDTOorm]:
    with session() as s:
        colors = s.query(ColorStatus).all()
        result = [ColorsDTOorm.model_validate(row, from_attributes=True) for row in colors]
        return result


# @app.post('/test-selectel')
# async def test():
#     await s3_client.upload_file("test.txt")


app.include_router(routerPage)
app.include_router(routerProjects)
app.include_router(routerBacklogs)
app.include_router(routerTaskLists)
app.include_router(routerTasks)
app.include_router(routerUsers)
app.include_router(routerAuth)





        # result = s.execute(query)

        # user.login = 'qwe'
        # s.commit()
        # print(users)
        # user = User(login=form.login, password=form.password)
        # s.add(user)
        # s.commit()


    # if(form.login == login and form.password == password):
    #     result = {'status':'done','user_id' : 1}
    #     response.set_cookie(key='user_id', value='1', samesite='none', secure=True)
    #     return result
    # else:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Incorrect username or password",
    #     )


# @app.post('/set-cookie')
# async def get_cookie(response: Response):
#     response.set_cookie(key='test_cookie', value='this is first cookie from fastAPI', samesite='none', secure=True)
#     return {'result': True}


# @app.post('/auth')
# # async def auth(user_id: Annotated[int | None, Cookie()] = None):
# async def auth(form: RegisterUserForm, response: Response):
#     if (form.login == login and form.password == password):
#         result = {'status': 'done', 'user_id': 1}
#         response.set_cookie(key='user_id', value='1', samesite='none', secure=True)
#         return result
#     else:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#         )