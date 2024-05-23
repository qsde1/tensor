from pydantic import BaseModel


class User(BaseModel):
    name: str
    img: str | None = None


class UserOrm(User):
    id: int

н
class Board(BaseModel):
    name: str
    description: str
    img: str | None = None
    user_id: int


class BoardOrm(Board):
    id: int


class Gift(BaseModel):
    name: str
    description: str
    img: str | None = None
    board_id: int


class GiftOrm(Gift):
    id: int


