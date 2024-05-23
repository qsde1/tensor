from fastapi import APIRouter
from schemas import Board, BoardOrm
router = APIRouter(
    tags=['boards'],
    prefix='/boards'
)

@router.get('/')
async def get_boards() -> list[Board]:
    pass


@router.get('/{board_id}')
async def get_board_by_id(board_id:int)-> BoardOrm:
    pass


@router.put('/{board_id}')
async def edit_board_by_id(body: Board) -> BoardOrm:
    pass

@router.delete('/{boards_id}')
async def delete_board_by_id(board_id:int)-> None:
    pass


@router.post('/create')
async def create_board(body: Board)-> BoardOrm:
    pass


@router.get('/friends')
async def get_friends_boards() -> list[Board]:
    pass




