import { Await, NavLink, Outlet, useLoaderData, useParams } from 'react-router-dom'
import { Layout, Flex, Button, Modal, Form, Input, Spin, Skeleton } from "antd";
import { createContext, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { TasksListsStoreContext } from '../contexts';
const { Sider, Content, Header } = Layout;

const styles = {
    layout: {
        height: '100%',
        width: '100%',
    },

    header: {
        borderBottom: '1px solid rgb(215, 215, 215)',
        height: '40px',
        padding: '0 10px'
    },

    sider: {        
        borderRight: '1px solid rgb(215, 215, 215)',
        padding: '25px 0',
        backgroundColor: 'white'
    },

    content: {
        // padding: '25px',
    }
}


const Backlog = observer(() => {
    let params = useParams();
    const taskListStore = useContext(TasksListsStoreContext);

    // const [backlog, setBacklog] = useState(null);
    // const [taskLists, setTaskLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    // let backlogNotState = backlog;
    // const [currentList, setCurrentList] = useState(null);


    // async function updateBacklog(){
    //     let result = await get_backlog_by_project_id(params.projectId);
    //     if(result.status == 200){
    //         setBacklog(result.data)
    //         backlogNotState = result.data;
    //     }
    // }

    // async function updateTaskLists(){
    //     let result = await get_task_lists_by_backlog_id(backlogNotState.id);
    //     if(result.status == 200)
    //         setTaskLists(result.data);
    // }

    useEffect(() => {
        (async ()=>{
            // await updateBacklog();
            // await updateTaskLists();
        })();
        taskListStore.connect();
        return () => taskListStore.close();
    }, [])


    useEffect(()=> {
        if(taskListStore.isStoreReady){
            taskListStore.getTaskLists();
        }
    }, [taskListStore.isStoreReady])

    useEffect(()=> {
        if(taskListStore.taskLists)
            setIsFirstLoading(false)
    }, [taskListStore.taskLists])

    const showModal = () => {
        setIsModalOpen(true);
    }

    const createTasksList = async (taskList) => {
        console.log(taskList);
        taskListStore.createTaskList({
            ...taskList, 
            backlog_id:taskListStore.backlogId,
        })
        // setBacklog({
        //     ...backlog,
        //     tasksLists: [
        //         ...backlog.tasksLists,
        //         {id:idNewList, backlogId:backlog.id, ...tasksListObj}
        //     ]
        // });
        // await create_task_list({
        //     ...taskList,
        //     backlog_id: backlog.id,
        // });
        // await updateTaskLists()
        setIsModalOpen(false);
    }

    const handleCancleModal = () => {
        console.log('отмена');
        setIsModalOpen(false);
    }

    return(        
        <>
        {isFirstLoading && 
            <div style={{padding: '50px'}}>
                <Skeleton loading={isFirstLoading} active avatar></Skeleton>
                <Skeleton loading={isFirstLoading} active avatar></Skeleton>
                <Skeleton loading={isFirstLoading} active avatar></Skeleton>
            </div>
        }
        {taskListStore.taskLists &&
            <>
                <Header
                    style={styles.header}
                >
                    <Flex
                        style={{
                            height: '100%',
                        }}
                        align='center'
                        justify='space-between'
                    >
                        <p></p>
                        <Button onClick={showModal}>Добавить список задач</Button>
                    </Flex>
                </Header>
                <Layout>
                    <BacklogSider tasksLists={taskListStore.taskLists}/>
                    <Content style={styles.content}>
                        <Outlet/>
                    </Content>
                </Layout>
                {isModalOpen && 
                <BacklogModal
                    isModalOpen={isModalOpen}
                    handleOk={createTasksList}
                    handleCancel={handleCancleModal}
                />
                }
            </>
        }
        </>
    )
})

export default Backlog;

const BacklogSider = ({tasksLists = []}) => {
    return (
        <Sider
            style={styles.sider}
            width={'165px'}
        >
            <Flex
                style={{
                    height: '100%'
                }}
                vertical
                justify='start'
                align='center'
            >                
                {tasksLists.length > 0 ? tasksLists.map(t =>
                    <NavLink
                        to={`backlog/${t.id}`}
                        key={'taskList_' + t.id}
                        style={{
                            marginBottom: '25px',
                            color: 'black',
                        }}

                    >
                        {t.name}
                    </NavLink>
                ) : 
                <p>Списков задач нет</p>
            }
            </Flex>
        </Sider>
    )
}

const BacklogModal = ({isModalOpen, handleOk, handleCancel}) => {

    let newTasksList = {}

    const handleClick = () => {        
        handleOk(newTasksList);
    }

    return (
        <Modal
            title='Добавление списка задач'
            okText='Добавить'
            cancelText='Отмена'
            open={isModalOpen}
            onOk={handleClick}
            onCancel={handleCancel}
            centered
        >
            
            <CreateTasksListForm
                handlerChangeValue={(obj) => newTasksList = obj}
            />
        </Modal>
    )
}

const CreateTasksListForm = ({handlerChangeValue}) => {
    function changeValue(changeValues, allValues) {
        handlerChangeValue(allValues)
    }

    return (
        <Form
            onValuesChange={changeValue}
        >
            <Form.Item
                label='Название списка'
                name='name'
            >
                <Input
                    placeholder='новый список'
                />
            </Form.Item>
        </Form>
    )
}