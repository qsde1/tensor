import { Flex, Layout, Button, Modal, Form, Input, Tag, Popover, Space, Table, Avatar, DatePicker, List as ListANT, Card, Cascader, Drawer, TimePicker, Upload, Dropdown, Skeleton } from "antd";
import { createContext, createRef, useContext, useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, StepForwardOutlined, UnorderedListOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
// import { change_status_task_by_id, create_task, delete_task_by_id, edit_task, get_colors, get_statuses_by_project_id, get_task_list_by_id, get_tasks_by_list_id, get_user_by_task_id, get_user_role_by_project_id, take_task } from "../Api/api";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { 
    ProjectStoreContext,
    UserStoreContext,
 } from "../contexts";
import Icon from "@ant-design/icons/lib/components/Icon";
import CommentsStore from "../store/comments-store";

const { Column, ColumnGroup } = Table;

let styles = {
    layoutStyle: {
        height: '100%',
        width: '100%',
        padding: '0 15px',
        overflow: 'hidden',
        overflowX:'auto',
    },

    headerStyle: {
        padding: '0 15px',
        height: '50px',
    },

    layoutContent: {
    }
}
const TasksList = observer(() => {
    const tasksStore = useLoaderData();
    const projectStore = useContext(ProjectStoreContext);
    const userStore = useContext(UserStoreContext);
    const [isModalCreateTaskOpen, setIsModalCreateTaskOpen] = useState(false);
    const [isModalEditTaskOpen, setIsModalEditTaskOpen] = useState(false);    
    const [isDrawerEditTaskOpen, setIsDrawerEditTaskOpen] = useState(false);
    const [viewType, setViewType] = useState('list')
    const [editableTask, setEditableTask] = useState(null);
    const [isFirstLoading, setIsFirstLoadig] = useState(true);

    useEffect(() => {
        tasksStore.connect();
        return () => tasksStore.close();
    }, [tasksStore])
    
    useEffect(() => {
        if(tasksStore.isStoreReady){
            tasksStore.getTaskList();
            tasksStore.getTasks();
        }
    }, [tasksStore.isStoreReady])

    useEffect(()=>{
        if(tasksStore.tasks){
            setIsFirstLoadig(false);
        }
    },[tasksStore.tasks])


    useEffect(() => {
        if(projectStore.users)
            console.log(projectStore.users);
    }, projectStore.users)
    
    const showModalCreateTask = () => {
        setIsModalCreateTaskOpen(true);
    };

    const closeModalCreateTask = () => {
        setIsModalCreateTaskOpen(false);
    };

    const showModalEditTask = (task) => {
        setEditableTask(task)
        setIsModalEditTaskOpen(true);
    };
    
    const closeModalEditTask = () => {
        setEditableTask(null)
        setIsModalEditTaskOpen(false);
    };

    const showDrawerEditTask = (task) => {
        setEditableTask(task)
        setIsDrawerEditTaskOpen(true)

    }

    const closeDrawerEditTask = () => {
        setEditableTask(null)
        setIsDrawerEditTaskOpen(false)
    }

    async function createTask(taskObj){
        let minCoeff = Math.min(...projectStore.statuses.map(s=>s.coefficient))
        let firstStatus = projectStore.statuses.find(s=>s.coefficient == minCoeff);
        console.log(firstStatus);
        let date = taskObj.expected_date;
        if(date)
            date = new Date(date.$y, date.$M, date.$D).getTime();        
        let task = {
            ...taskObj,
            tasks_list_id: tasksStore.taskList.id,
            description: '',
            executor_id: null,
            creator_id: userStore.user.id,
            status_id: firstStatus.id,
            appointment_date: new Date().getTime(),
            expected_date: date ? date.toString() : date,
        }
        tasksStore.createTask(task)
    }

    async function editTask(task){
        let date = task.expected_date;
        if(date)
            date = new Date(date.$y, date.$M, date.$D).getTime();
    }

    
    async function changeStatusTask(taskId, statusId) {
        tasksStore.changeStatusTask(taskId, statusId);
    }


    async function changeTaskName(taskName, taskId){
    }

    async function deleteTask(taskId) {
        tasksStore.deleteTask(taskId)
        // await delete_task_by_id(taskId);
        // await updateTasksState();
    }
    
    async function addTaskExecutor(taskId, executorId){
        tasksStore.addTaskExecutor(taskId, executorId);
    }

    const handleCancleModal = () => {
        console.log('отмена');
        setIsModalCreateTaskOpen(false);
    }

    const changeViewType = (type) => {
        setViewType(type)
    }


    return (
        <>
            {...[1,2,3,4,5,6].map(_=><Skeleton loading={isFirstLoading} active avatar></Skeleton>)}
            <Layout
                style={styles.layoutStyle}
            >   
                {(tasksStore.tasks && projectStore.statuses?.length > 0) && 
                <>
                    <TasksHeader
                        name={tasksStore.taskList.name}
                        handlerClick={showModalCreateTask}
                        changeViewType={changeViewType}
                        viewType={viewType}
                    />

                    <Layout.Content
                        style={styles.layoutContent}
                    >
                    {tasksStore.tasks.length == 0 &&
                        <Flex
                            vertical
                            justify="center"
                            align="center"
                            style={{
                                height: '100%',
                            }}
                        >
                            <p>Задач в списке нет</p>
                            <Button onClick={showModalCreateTask}>Добавить задачу</Button>   {/* тут onClick={addTask} */}
                        </Flex> 
                    }
                    {tasksStore.tasks.length > 0 &&
                    <>
                        {viewType == 'list' &&
                        <List
                            colors={projectStore.colors}
                            statuses={projectStore.statuses}
                            tasks={tasksStore.tasks}
                            showModalEditTask={showModalEditTask}
                            deleteTask={deleteTask}
                            changeStatusTask={changeStatusTask}
                            currentUserRole={projectStore.currentUserRole}
                            users={projectStore.users}
                            addTaskExecutor={addTaskExecutor}
                            currentUser={userStore.user}
                            showDrawerEditTask={showDrawerEditTask}
                            closeDrawerEditTask={closeDrawerEditTask}
                        />
                        }
                        {viewType == 'canban' && 
                        <Canban
                            colors={projectStore.colors}
                            statuses={projectStore.statuses}
                            tasks={tasksStore.tasks}
                            showModalEditTask={showModalEditTask}
                            deleteTask={deleteTask}
                            changeStatusTask={changeStatusTask}
                            currentUserRole={projectStore.currentUserRole}
                            users={projectStore.users}
                            addTaskExecutor={addTaskExecutor}
                            currentUser={userStore.user}
                            showDrawerEditTask={showDrawerEditTask}
                            closeDrawerEditTask={closeDrawerEditTask}
                        />
                        }
                    </>
                    }
                    </Layout.Content>
                </>
                }
            </Layout>
            {isModalCreateTaskOpen && 
                <AddTaskModal
                    isModalOpen={isModalCreateTaskOpen}
                    createTask={createTask}
                    closeModal={closeModalCreateTask}
                />
            }
            {isModalEditTaskOpen &&
                <EditTaskModal
                    isModalOpen={isModalEditTaskOpen}
                    editTask={editTask}
                    closeModal={closeModalEditTask}
                    task={editableTask}
                />
            }
            {isDrawerEditTaskOpen &&
                <DrawerEditTask
                    closeDrawer={closeDrawerEditTask}
                    isDrawerOpen={isDrawerEditTaskOpen}
                    editTask={editTask}
                    task={tasksStore.tasks.find(t=>t.id == editableTask.id)}
                    users={projectStore.users}
                    statuses={projectStore.statuses}
                    addTaskExecutor={addTaskExecutor}
                    currentUser={userStore.user}
                    currentUserRole={projectStore.currentUserRole}
                    changeNameTask={tasksStore.changeNameTask}
                    changeDescriptionTask={tasksStore.changeDescriptionTask}
                    deleteTask={deleteTask}
                />
            }
        </>
    );
})

export default TasksList;

const TasksHeader = ({
    name,
    handlerClick,
    changeViewType,
    viewType,
}) => {
    return (
        <Layout.Header
            style={styles.headerStyle}
        >
            <Flex
                align="center"
                justify="space-between"
                style={{
                    height: '100%'
                }}
            >
                <Flex
                     align="center"
                >
                    <b>{name}</b>
                    <Button
                        onClick={handlerClick}
                        type='text'
                    >
                            +
                    </Button>
                </Flex>
                <Flex
                    align="center"
                    gap='middle'
                >
                    <Button
                        type='text'
                        onClick={()=> changeViewType('list')}
                        style={{
                            backgroundColor: viewType == 'list' ? 'rgb(219, 219, 219)' : null
                        }}
                    >
                            <UnorderedListOutlined />
                    </Button>
                    <Button
                        type='text'
                        onClick={()=> changeViewType('canban')}
                        style={{
                            backgroundColor: viewType == 'canban' ? 'rgb(219, 219, 219)' : null
                        }}
                    >
                        <Icon
                            component={()=>
                                <svg fill="none" height="24" strokeWidth="1.5" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3.6V20.4C3 20.7314 3.26863 21 3.6 21H20.4C20.7314 21 21 20.7314 21 20.4V3.6C21 3.26863 20.7314 3 20.4 3H3.6C3.26863 3 3 3.26863 3 3.6Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L6 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 6V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 6V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 6V11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            }
                        />
                    </Button>
                </Flex>
            </Flex>
        </Layout.Header>
    )
}


const AddTaskModal = ({
    isModalOpen,
    createTask,
    closeModal
}) => {
    let newTask = {}
    return (
        <Modal
            title='Новая задача'
            okText='Добавить' 
            cancelText='Отмена'
            open={isModalOpen}
            onOk={() => {
                createTask(newTask);
                closeModal();
            }}
            onCancel={closeModal}
            centered
        >
            <CreateTaskForm
                handlerChangeValue={(obj) => {
                    newTask = obj;
                }}
            />
        </Modal>
    )
}

const EditTaskModal = ({
    isModalOpen,
    editTask,
    closeModal,
    task
}) => {
    let {id, ...editableTask} = task;

    return (
        <Modal
            title={'Редактирование задачи'}
            okText='Редактировать' 
            cancelText='Отмена'
            open={isModalOpen}
            onOk={() => {
                editTask({
                    id,
                    ...editableTask,
                });
                closeModal();
            }}
            onCancel={closeModal}
            centered
        >
            <EditTaskForm                
                task={editableTask}
                handlerChangeValue={(obj) => {
                    Object.assign(editableTask, obj)
                }}
            />
        </Modal>
    )
}

const DrawerEditTask = observer(({
    closeDrawer,
    isDrawerOpen,
    editTask,
    task,
    users,
    statuses,
    addTaskExecutor,
    currentUser,
    currentUserRole,
    changeNameTask,
    changeDescriptionTask,
    deleteTask
}) => {
    const ref = useRef(new CommentsStore(task.id))
    let commentsStore = ref.current
    const [creator, setCreator] = useState(null)
    const [executor, setExecutor] = useState(null)
    const [status, setStatus] = useState(null)

    const [isNameEdit, setIsNameEdit] = useState(false)
    const [nameTask, setNameTask] = useState(null);

    const [isDescriptionEdit, setIsDescriptionEdit] = useState(false)
    const [descriptionTask, setDescriptionTask] = useState(null)

    const [commentText, setCommentText] = useState(null)


    useEffect(()=>{
        commentsStore.connect()
        return ()=>commentsStore.close();
    },[])

    useEffect(()=>{
        if(commentsStore.isStoreReady){
            commentsStore.getComments()
        }

    }, [commentsStore.isStoreReady])


    useEffect(()=>{
        setCreator(users.find(u=>u.id == task.creator_id))
        setExecutor(users.find(u=>u.id == task.executor_id))
        setStatus(statuses.find(s=>s.id == task.status_id))
    }, [task, users])
    
    return (
        <>
            {(creator && status) &&
                <Drawer title='Информация о задаче' onClose={closeDrawer} open={isDrawerOpen}>
                    <Flex
                        vertical
                        gap='middle'
                        style={{
                            height: '100%'
                        }}
                        // size={"middle"}
                    >
                        <h4>
                            Название
                            {currentUserRole == 'creator' && 
                            <Button
                                type="flat"
                                onClick={()=>{
                                    setIsNameEdit(true)
                                    setNameTask(task.name)
                                }}>
                                <EditOutlined />
                            </Button>
                            }
                        </h4>
                        {isNameEdit ?
                            <>
                                <Input value={nameTask} onChange={(e)=>setNameTask(e.target.value)}/>
                                <Button onClick={()=>{
                                    changeNameTask(task.id, nameTask);
                                    setNameTask(null);
                                    setIsNameEdit(false);
                                }}>Сохранить</Button>
                            </>
                            
                            : <p>{task.name}</p>
                        }

                        <h4>
                            Описание
                            {currentUserRole == 'creator' &&
                                <Button
                                    type="flat"
                                    onClick={()=>{
                                        setIsDescriptionEdit(true)
                                        setDescriptionTask(task.description)
                                    }}
                                >
                                    <EditOutlined />
                                </Button>
                            }
                        </h4>
                        {isDescriptionEdit ?
                            <>
                                <Input value={descriptionTask} onChange={(e)=>setDescriptionTask(e.target.value)}/>
                                <Button onClick={()=>{
                                    changeDescriptionTask(task.id, descriptionTask);
                                    setDescriptionTask(null);
                                    setIsDescriptionEdit(false);
                                }}>
                                    Сохранить
                                </Button>
                            </>
                            : <p>{task.description ||<>У задачи нет описания</>}</p>
                        }

                        <h4>Сроки<Button type="flat"><EditOutlined /></Button></h4>
                        <div>Дата назначения: <TimePicker value={dayjs(+task.appointment_date)}/></div>
                        <div>
                            Ожидаемая дата завершения:
                            {task.expected_date ?
                                <TimePicker value={dayjs(+task.appointment_date)}/>
                                : 'дата завершения не указана' 
                            }
                            
                        </div>

                        <h4>Создатель</h4>
                        <div>
                            <Avatar src={creator.img}/><> </>{creator.name}
                        </div>
                        <h4>Исполнитель</h4>                       
                        <div>                            
                        
                            {currentUserRole == 'creator' && 
                            <Dropdown
                                menu={{
                                    items: [...users.map(u=> {
                                        return {
                                            key:u.id,
                                            label: <>
                                                <Avatar src={u.img}/><> </>{u.name}
                                            </>
                                        }
                                    })],
                                    onClick:(({key})=>{
                                        addTaskExecutor(task.id, key);
                                    })
                                }}
                            >
                                {executor ?
                                    <Button type="text" size="large" style={{display: 'flex', alignItems: 'center', padding: "15px 15px 15px 0"}}>
                                        <Avatar src={executor.img}/>
                                        {executor.name}
                                    </Button>
                                    :<Tag>Назначить</Tag>
                                }
                            </Dropdown>
                            }
                            {currentUserRole != 'creator' && 
                            <p>
                                {executor ?
                                <>
                                    <Avatar src={executor.img}/>{executor.name}
                                </>
                                    : 'У задачи нет исполнителя'
                                }
                            </p>
                            }
                        </div>
                        <Button color="red" onClick={()=>{
                            deleteTask(task.id)
                            closeDrawer();
                        }}>
                                Удалить
                        </Button>
                        <h4>Комментарии</h4>
                        <Flex
                            vertical
                            justify="space-between"
                            style={{
                                // border: '1px solid black',
                                flexGrow: '2',
                                overflow: 'hidden',
                                overflowY: 'auto',
                            }}
                        >
                            <div>
                                <Skeleton loading={!commentsStore.comments} active></Skeleton>
                                {commentsStore.comments &&
                                    <Space
                                        direction="vertical"
                                        size='large'
                                        style={{
                                            width: '100%',
                                        }}
                                    >
                                        {...commentsStore.comments?.map(c=>(
                                        <p
                                            style={{
                                                backgroundColor: 'rgb(227,227,227)',
                                                borderRadius: '10px',
                                                padding: '2px 5px',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'wrap'
                                            }}
                                        >
                                            <Avatar src={users.find(u=>u.id==c.user_id).img}/>{users.find(u=>u.id==c.user_id).name}<br/>
                                            {c.text}
                                        </p>
                                    ))}
                                    </Space>
                                }
                            </div>
                        </Flex>
                        <Flex
                            gap={'small'}
                            style={{
                                flexGrow: 0,
                            }}
                        >
                            <Input
                                type="text"
                                value={commentText}
                                onChange={e=>setCommentText(e.target.value)}
                            />
                            <Button
                                type=""
                                onClick={()=>{
                                    if(commentText != ""){
                                        commentsStore.createComment({
                                            text:commentText,
                                            userId:currentUser.id,
                                            created: new Date().getTime()
                                        })
                                        setCommentText(null)
                                    }
                                }}
                            >
                                Отправить
                            </Button>
                        </Flex>
                    </Flex>
                </Drawer>
            }
        </>
    )   
})

const CreateTaskForm = ({handlerChangeValue}) => {

    return (
        <Form
            onValuesChange={(changeValues, allValues)=>handlerChangeValue(allValues)}
        >
            <Form.Item 
                label='Название'
                name='name'
            >
                <Input placeholder='...'/>
            </Form.Item>
            <Form.Item 
                label='Дата завершения'
                name='expected_date'
            >
                <DatePicker/>
            </Form.Item>
        </Form>
    )
}

const EditTaskForm = ({handlerChangeValue, task}) => {    
    return (
        <Form
            initialValues={{
                ...task,
                expected_date: task.expected_date ?  dayjs(+task.expected_date) : null
            }}
            onValuesChange={(_,allValues)=>{
                console.log(allValues);
                handlerChangeValue(allValues);
            }}
        >
            <Form.Item
                label="Название"
                name='name'
                key={task.name}
            >
                <Input placeholder={task.name}/>
            </Form.Item>
            <Form.Item
                label="Описание"
                name='description'
                key={task.description}
            >
                <TextArea placeholder={task.description} autoSize={{minRows: 4}}/>
            </Form.Item>
            <Form.Item
                label="Ожидаемая дата завершения"
                name='expected_date'
                key={task.expected_date}
            >
                <DatePicker
                />
            </Form.Item>
        </Form>
    )
}

const List = ({
    tasks,
    colors,
    statuses,
    showModalEditTask,
    showDrawerEditTask,
    closeDrawerEditTask,
    deleteTask,
    changeStatusTask,
    currentUserRole,
    currentUser,
    users,
    addTaskExecutor,
}) => {
    let sortedTask = [...tasks]
    sortedTask = sortedTask.sort((a,b)=> a.id < b.id ? -1 : a.id == b.id ? 0 : 1)
    
    function getDate(timestamp){
        let date = new Date(+timestamp);
        let day = date.getDate();        
        let month = date.getMonth()+1;
        let year  = date.getFullYear().toString().slice(-2);
        return `${day.toString().length == 2 ? day : '0'+day}.${month.toString().length == 2 ? month : '0'+month}.${year}`;

    }
    return (
        <>
        <Table dataSource={[...sortedTask.map(t=>{
            return {
                ...t,
                key: t.id
            }
        })]}>
            <Column
                title="Название"
                dataIndex="name"
                key="name"
                render={(text,record, index) => {
                    return(
                        <>
                        <ExecutorTask
                            task={record}
                            currentUserRole={currentUserRole}
                            currentUser={currentUser}
                            users={users}
                            addTaskExecutor={addTaskExecutor}
                        />
                        <span
                            style={{
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                showDrawerEditTask(record);
                                // showModalEditTask(record)
                            }}
                        >
                            {record.name}
                        </span>
                        </>
                    )
                }}
            />

            <Column
                title="Дата создания"
                dataIndex="appointment_date"
                key="appointment_date"
                render={(text,record, index) => {
                    return(
                        <>
                        {getDate(text)}
                        </>
                    )
                }}
            />

            <Column
                title="Ожидаемая дата завершения"
                dataIndex="expected_date"
                key="expected_date"
                render={(text,record, index) => {
                    return(
                        <>
                        {text && getDate(text)}
                        {!text && '-'}
                        </>
                    )
                }}
            />

            <Column
                title="Статус"
                dataIndex="statusId"
                key="statusId"
                render={(text, record, index) =>(
                    <>
                        <PopoverStatus
                            task={record}
                            statuses={statuses}
                            colors={colors}
                            changeStatusTask={changeStatusTask}
                        />
                    </>
                )}
            />

            <Column
                title="Действия" 
                key="action"
                render={(text,record, index) => (
                    <>
                        <Button
                            type="flat"
                            onClick={() => {
                                deleteTask(record.id);
                            }}
                            style={{
                            }}
                            size="large"
                        >
                            <DeleteOutlined 
                                style={{
                                    fontSize: 20
                                }}
                            />
                        </Button>
                    </>
                )}              
            />
        </Table>
        </>
    )
}

const Canban = ({
    colors,
    statuses,
    tasks,
    showModalEditTask,
    deleteTask,
    changeStatusTask,
    currentUserRole,
    users,
    addTaskExecutor,
    currentUser,
    showDrawerEditTask,
    closeDrawerEditTask,
}) => {
    let sortedStatuses = [...statuses].sort((a,b)=>{
        if(a.coefficient < b.coefficient) return -1
        if(a.coefficient > b.coefficient) return 1
        return 0
    })
    let draggableTaskId = null;
    return (
        <Flex
            align="start"      
            gap={55}
            style={{
                height: '100%',
            }}
        >
        {...sortedStatuses.map(s=>{
            return (
                <div
                    onDragOver={e=>{
                        e.preventDefault()
                    }}
                    onDrop={e=>{
                        e.preventDefault()
                        changeStatusTask(draggableTaskId, s.id)
                        draggableTaskId = null;
                    }} 
                    style={{
                        height: '95%',
                        width: '350px',
                        border: '1px solid rgb(129, 129, 129)',
                        borderRadius: '10px',
                        flexShrink: 0,
                        padding: '5px 0 0 0'
                    }}
                >
                    <p
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            margin: '0 0 10px 0'
                        }}
                    >
                        <Tag color={colors.find(c=>c.id == s.color_id).name}>{s.name}</Tag>
                        
                    </p>
                    <Flex
                        vertical
                        align="center"
                        gap={50}
                        style={{
                            width: '100%'
                        }}
                    >
                        {...tasks
                            ?.filter(t=>t.status_id == s.id)
                            .map(t=>{
                                return (
                                    <Card
                                        draggable
                                        onDragStart={e=>{
                                            draggableTaskId = t.id
                                        }}                                                                              
                                        style={{
                                            width: '80%',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ExecutorTask
                                            task={t}
                                            addTaskExecutor={addTaskExecutor}
                                            users={users}
                                            currentUserRole={currentUserRole}
                                            currentUser={currentUser}
                                        />
                                        <span
                                            onClick={()=>showDrawerEditTask(t)}
                                        >
                                            {t.name}
                                        </span>
                                    </Card>
                                )
                            })
                        }
                    </Flex>
                </div>
            )
        })}
        </Flex>
    )
}

const ExecutorTask = ({
    task,    
    addTaskExecutor,
    users,
    currentUserRole,
    currentUser,
}) => {
 

    // const [executor, setExecutor] = useState(null)
    // const [imgAvatar, setImgAvatar]  = useState(null)

    // const updateExecutorState = async () =>  {        
    //     let result = await get_user_by_task_id(taskId);        
    //     if(result.data){
    //         setExecutor(result.data);
    //     }
    // }

    // const updateImgAvatarState = async () => {
    //     let url = faker.image.urlLoremFlickr({ category: 'abstract' });
    //     console.log(url);
    // }

    // useEffect(()=>{
    //     (async ()=>{
    //         await updateExecutorState();
    //     })()
    // }, [])
    const executor = task.executor_id ? users.find(u => u.id == task.executor_id) : null
    return (
        <>
        {executor &&
            <Popover
                content={
                    <>
                        {executor.name} {executor.surname}
                    </>
                }
            >
                <Avatar
                    icon={<UserOutlined/>}
                    src={executor.img}
                    style={{
                        marginRight: '5px'
                    }}
                />
            </Popover>
        }
        {!executor &&
        <>
            {/* <Cascader
                options={[...users.map(u=> {
                    return {
                        value:u.id,
                        label: <>
                            <Avatar src={u.img}/><> </>{u.name}
                        </>
                    }
                })]}
                onChange={(_,option)=>addTaskExecutor(task.id, option[0].value)}
            >
                <PlusCircleOutlined /> 
            </Cascader> */}
            {currentUserRole == 'creator' && 
            <Dropdown
                menu={{
                    items: [...users.map(u=>{
                        return {
                            key:u.id,
                            label: <>
                                <Avatar src={u.img}/><> </>{u.name}
                            </>
                        }
                    })],
                    onClick:(({key})=>{
                        addTaskExecutor(task.id, key);
                    })
                }}
            >
                <PlusCircleOutlined />
            </Dropdown>
            }

            {currentUserRole != 'creator' &&
                <Button
                    type="text"
                    onClick={
                        ()=>addTaskExecutor(task.id, currentUser.id)
                    }
                >
                <PlusCircleOutlined />
                </Button>
            }
        </>
        }
        </>
    )

}


const ChangeTaskForm = ({handlerChangeValue}) => {
    function changeValue(changeValues, allValues) {
        handlerChangeValue(allValues);
    }

    return (
        <Form
            name="updateTaskForm"
            initialValues={selectedTask}
            onFinish={handleSave}
        >
            <Form.Item 
                label='Название'
                name='name'
            >
                <Input />
            </Form.Item>
            <Button htmlType="submit">Сохранить</Button>
        </Form>
    )
}

const PopoverStatus = ({
    statuses,
    colors,
    changeStatusTask,    
    task,
}) => {

    const statusInButton = statuses?.find(s=>s.id == task.status_id);
    const statusesInPopover = statuses?.filter(s=>s.id != task.status_id);
    const colorTagButton = colors?.find(c=>c.id==statusInButton.color_id)?.name || 'default';

    const [open, setOpen] = useState(false)   
    
    function hide(){
        setOpen(false)
    }

    function handleOpen(isOpen){
        setOpen(isOpen)
    }

    return (
    <Popover
        title="Изменить статус"
        trigger="click"
        open={open}
        onOpenChange={handleOpen}
        content={
        <Space
            direction="vertical"
        >   
            {statusesInPopover.map(s => {
                return(
                    <p key={s.id}
                        style={{
                            cursor: 'pointer'
                        }}
                    >   
                        <Tag
                            color={colors?.find(c=>c.id == s.color_id)?.name}
                            onClick={()=>{
                                hide();
                                changeStatusTask(task.id, s.id);
                            }}
                        >
                            {s.name}
                        </Tag>                                          
                    </p>
                )
            })}
        </Space>
        }
    >
        
        <Button type="flat">
            <Tag
                color={colorTagButton}
            >
                {statusInButton.name}
            </Tag>
        </Button>
       
    </Popover>
    )
}