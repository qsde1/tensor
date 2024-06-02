from pydantic import BaseModel, ConfigDict


class Payload(BaseModel):
    user_id: int

class UserDTO(BaseModel):
    login: str
    password: str


class UserRegistration(UserDTO):
    name: str
    surname: str
    img: str | None = None


class UserDTOorm(UserRegistration):
    id: int


class BacklogDTO(BaseModel):
    id: int
    project_id: int


class TaskListDTOToCreate(BaseModel):
    name: str
    backlog_id: int


class TaskListDTOorm(TaskListDTOToCreate):
    id: int


class TasksDTO(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True)
    name: str
    description: str
    appointment_date: str
    expected_date: str | None = None
    creator_id: int
    executor_id: int | None = None
    status_id: int
    tasks_list_id: int


class TasksDTOorm(TasksDTO):
    id: int


class ChangeStatusTaskDTO(BaseModel):
    status_id: int
    executor_id: int


class ProjectCreateDTO(BaseModel):
    name: str
    description: str | None = None


class ProjectCreate(ProjectCreateDTO):
    creator_id: int


class ProjectDTO(ProjectCreateDTO):
    id: int


class StatusDTOCreate(BaseModel):
    name: str
    project_id: int
    is_first: bool = False
    color_id: int


class StatusDTOorm(StatusDTOCreate):
    id: int