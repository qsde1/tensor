from database.models import User
from database.db_core import session


def get_user_by_id(user_id):
    with session() as s:
        user = s.get(User, user_id)
        return user


def get_user_by_login(login):
    with session() as s:
        user = s.query(User).where(User.login == login).first()
        return user

def create_user(user_obj):
    with session() as s:
        user = User(login=user_obj.login, password=user_obj.password, name=user_obj.name, surname=user_obj.surname, img=user_obj.img)
        s.add(user)
        s.commit()
        return user


