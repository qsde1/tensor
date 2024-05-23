from fastapi import APIRouter
from schemas import Board, BoardOrm, Gift, GiftOrm

router = APIRouter(
    tags=['gifts'],
    prefix='/gifts'
)

@router.get('/')
async def get_gifts()->list[GiftOrm]:
    pass

@router.get('/{gift_id}')
async def get_gift_by_id(gift_id:int)-> GiftOrm:
    pass

@router.put('/{gift_id}')
async def edit_gift_by_id(body: Gift) -> GiftOrm:
    pass

@router.delete('/{gift_id}')
async def delete_gift_by_id(gift_id:int)-> None:
    pass

@router.post('/create')
async def create_gift(body: Gift)-> GiftOrm:
    pass




