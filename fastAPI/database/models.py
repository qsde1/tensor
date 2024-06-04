from sqlalchemy import Table, Column, Integer, String, MetaData, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.types import TIMESTAMP

# metadata_obj = MetaData()
#
# test_table = Table(
#     'test',
#     metadata_obj,
#     Column('username', String)
# )


class Base(DeclarativeBase):
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    pass


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str]
    name: Mapped[str]
    surname: Mapped[str] = mapped_column(nullable=True)
    password: Mapped[bytes]
    img: Mapped[str]

    projects: Mapped[list['Project']] = relationship(
        back_populates="users",
        secondary='projects_users'
    )

    users: Mapped[list['TaskComment']] = relationship(back_populates='user', cascade='all')


class Project(Base):
    __tablename__ = 'projects'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    description: Mapped[str] = mapped_column(nullable=True)
    backlog: Mapped['Backlog'] = relationship(back_populates='project', cascade='all')
    statuses: Mapped[list['StatusTask']] = relationship(back_populates='project', cascade='all')

    users: Mapped[list['User']] = relationship(
        back_populates="projects",
        secondary='projects_users'
    )

    invite_links: Mapped[list['ProjectLinkInvite']] = relationship(back_populates='project', cascade='all')


class ProjectLinkInvite(Base):
    __tablename__ = 'projects_links_invite'

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id', ondelete="CASCADE"))
    link: Mapped[str] = mapped_column(nullable=False, unique=True)

    project: Mapped['Project'] = relationship(back_populates='invite_links')


class ProjectsUsers(Base):
    __tablename__ = 'projects_users'


    project_id: Mapped[int] = mapped_column(
        ForeignKey('projects.id', ondelete="CASCADE"),
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id', ondelete="CASCADE"),
        primary_key=True,

    )

    role: Mapped[str] = mapped_column(server_default="user")



class Backlog(Base):

    __tablename__ = 'backlogs'

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey('projects.id', ondelete="CASCADE"))

    project: Mapped['Project'] = relationship(back_populates='backlog')
    task_lists: Mapped[list['TaskList']] = relationship(back_populates='backlog', cascade='all')

class TaskList(Base):
    __tablename__ = 'task_lists'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default='новый список')
    backlog_id: Mapped[int] = mapped_column(ForeignKey('backlogs.id', ondelete="CASCADE"))

    backlog: Mapped['Backlog'] = relationship(back_populates='task_lists')
    tasks: Mapped[list['Task']] = relationship(back_populates='tasks_list', cascade='all')


class StatusTask(Base):
    __tablename__ = 'statuses'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default='новый статус')
    coefficient: Mapped[int] = mapped_column(default=1)
    # is_first: Mapped[bool] = mapped_column(server_default="False")
    project_id: Mapped[str] = mapped_column(ForeignKey('projects.id', ondelete="CASCADE"))
    color_id: Mapped[int] = mapped_column(ForeignKey('colors_statuses.id', ondelete="SET NULL"))

    project: Mapped['Project'] = relationship(back_populates='statuses')
    tasks: Mapped[list['Task']] = relationship(back_populates='status')

    color: Mapped['ColorStatus'] = relationship(back_populates='statuses')


class ColorStatus(Base):
    __tablename__ = 'colors_statuses'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)

    statuses: Mapped[list['StatusTask']] = relationship(back_populates='color')

class Task(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(default='новая задача')
    description: Mapped[str] = mapped_column(nullable=True)
    appointment_date: Mapped[str] = mapped_column(nullable=False)
    expected_date: Mapped[str] = mapped_column(nullable=True)

    tasks_list_id: Mapped[int] = mapped_column(ForeignKey('task_lists.id', ondelete="CASCADE"))
    creator_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    executor_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    status_id: Mapped[int] = mapped_column(ForeignKey('statuses.id'), nullable=False)
    tasks_list: Mapped['TaskList'] = relationship(back_populates='tasks')
    creator: Mapped['User'] = relationship('User', foreign_keys=[creator_id])
    executor: Mapped['User'] = relationship('User', foreign_keys=[executor_id])
    status: Mapped['StatusTask'] = relationship(back_populates='tasks')

    comments: Mapped[list['TaskComment']] = relationship(back_populates='task', cascade='all')


class TaskComment(Base):
    __tablename__ = 'task_comments'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id', ondelete="CASCADE"), nullable=True)
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id', ondelete="CASCADE"), nullable=True)
    created: Mapped[str]
    text: Mapped[str]

    user: Mapped['User'] = relationship('User', foreign_keys=[user_id])
    task: Mapped['Task'] = relationship('Task', foreign_keys=[task_id])



class TaskFile(Base):
    __tablename__  = 'task_files'

    id: Mapped[int] = mapped_column(primary_key=True)
    file_name: Mapped[str] = mapped_column(nullable=False)

