from sqlalchemy import URL, create_engine, MetaData, insert
from sqlalchemy.orm import Session, sessionmaker
from .models import Base, ColorStatus
url = 'postgresql+psycopg://dplm_user:WLYiC66IBGy4LYQ5Lp60R8n8jNNcGup2@dpg-cpe47jnsc6pc73999vlg-a.oregon-postgres.render.com/dplm'
localurl = 'postgresql+psycopg://postgres:1@localhost:5432/dplm'
engine = create_engine(
    url=url,
    # echo=True,
)

session = sessionmaker(engine)


def create_tables():
    with session() as s:
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)

        colorList = [
            'magenta',
            'red',
            'volcano',
            'orange',
            'gold',
            'lime',
            'green',
            'cyan',
            'blue',
            'geekblue',
            'purple',
        ]

        for color in colorList:
            color = ColorStatus(name=color)
            s.add(color)
        s.commit()
        return


# def insert_data():
#     with session() as s:
#         test = TestTable(username='test2')
#         s.add(test) #можно использовать add_all
#         s.commit()

