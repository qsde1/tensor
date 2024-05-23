from fastapi import APIRouter
from schemas import Board, BoardOrm, Gift, GiftOrm, User, UserOrm

router = APIRouter(
    tags=['users'],
    prefix='/users'
)

@router.get('/')
async def get_users()->list[User]:
    pass

@router.get('/{user_id}')
async def get_user_by_id(user_id:int)-> GiftOrm:
    pass

@router.put('/{user_id}')
async def edit_user_by_id(body: User) -> UserOrm:
    pass

@router.delete('/{user_id}')
async def delete_user_by_id(user_id:int)-> None:
    pass

@router.post('/create')
async def create_user(body: User)-> UserOrm:
    pass


