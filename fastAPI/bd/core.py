from sqlalchemy import create_engine 
from sqlalchemy.orm import Session, sessionmaker

engine = create_engine(
    url='postgresql+psycopg://postgres:1@localhost:5432/tensor',
    # echo=True,
)

session = sessionmaker(engine)

