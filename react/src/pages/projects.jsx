import { createContext, useContext, useEffect, useState } from 'react';
import {
    Layout,
    Button,
    Modal,
    Flex,
    Card,
    Form,
    Input,
    Space,
    Skeleton,
    Spin,
} from 'antd';
import { redirect, useLoaderData, useNavigate } from 'react-router-dom';
import { create_project, delete_project, get_projects } from '../Api/api';
import { DeleteOutlined, ScheduleOutlined, createFromIconfontCN } from '@ant-design/icons';

const ProjectsContext = createContext(null)

let styles = {
    layoutStyle: {
        height: '100%',
        width: '100%',
    },

    headerStyle: {
        borderBottom: '1px solid rgb(215, 215, 215)',
    },

    layoutContent: {
        padding: '25px',
    }

}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const Projects = () => {    
    // const userIdFromCookie = useLoaderData();

    const [projectsList, setProjectsList] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);    
    const [isFirstLoading, setIsFirstLoading] = useState(true);

    async function updateProjectsList(){
        let projects = await get_projects();
        setProjectsList(projects);
    }

    useEffect(() => {
        (async ()=>{
            await updateProjectsList();
        })()
    }, [])

    useEffect(()=> {
        if(projectsList)
            setIsFirstLoading(false)
    }, [projectsList])

    const showModal = () => {
        setIsModalOpen(true);
    }

    const createProject = async (projectObj) => {
        setIsModalOpen(false);
        console.log(projectObj);
        await create_project(projectObj);
        // await createProjectApi(projectObj);

        // let projects = await getProjects();
        // setProjectsList(projects);

        await updateProjectsList();
    }

    const deleteProjectById = async (projectId) => {
        let result = await delete_project(projectId)
        if(result.status == 200)
            await updateProjectsList();
        else
            console.log(result);
    }

    const handleCancleModal = () => {
        console.log('отмена');
        setIsModalOpen(false);
    }

    return (
        <>
            {isFirstLoading &&
                <Flex
                    align='center'
                    justify='center'
                    style={{
                        height: '100%'
                    }}
                >
                    <Spin size={'large'}/>
                </Flex>
            }
            <ProjectsContext.Provider value={projectsList}>
                <Layout style={styles.layoutStyle}>
                    <ProjectsHeader handleClickAddProject={showModal}/>
                    <Layout.Content style={styles.layoutContent}>
                        {(projectsList && projectsList.length > 0) && 
                            <ProjectsList
                                deleteProjectById={deleteProjectById}
                            />
                        }
                        {(!projectsList || !projectsList.length > 0) &&
                            <>
                                <Flex
                                    style={{
                                        width: '100%',
                                        height: '100%',                                    
                                    }}
                                    justify='center'
                                    align='center'
                                >
                                    <img src="null_project.png" alt="" />
                                </Flex>
                            </>
                        }
                    </Layout.Content>
                </Layout>
                {isModalOpen && 
                <ProjectsModal
                    isModalOpen={isModalOpen}
                    handleOk={createProject}
                    handleCancel={handleCancleModal}
                />                
                }
            </ProjectsContext.Provider>
        </>
    )
}

export default Projects;

const ProjectsHeader = ({handleClickAddProject}) => {
    return (
        <Layout.Header style={styles.headerStyle}>
            <Flex
                align='center'
                justify='end'
                style={{
                    padding: '0 5px 0 0'
                }}
            >
                <div>
                    <div>
                        <Button onClick={handleClickAddProject} >Создать проект</Button>
                    </div>
                </div>
            </Flex>
        </Layout.Header>
    )
}

const ProjectsModal = ({isModalOpen, handleOk, handleCancel}) => {
    let newProject = {}

    return (        
        <Modal
            title='Создание проекта'
            okText='Создать'
            cancelText='Отмена'
            open={isModalOpen}
            onOk={() => handleOk(newProject)}
            onCancel={handleCancel}
            centered
        >
            <CreateProjectForm
                handlerChangeValue={(obj) => newProject = obj}
            />
        </Modal>
    )
}

const CreateProjectForm = ({handlerChangeValue}) => {

    function changeValue(changeValues, allValues) {
        handlerChangeValue(allValues)
    }

    return (
        <Form
            onValuesChange={changeValue}
        >
            <Form.Item
                label='Название проекта'
                name='name'
            >
                <Input
                    placeholder='новый проект'
                />
            </Form.Item>
            <Form.Item
                label='Описание проекта'
                name='description'
            >
                <Input.TextArea
                    placeholder='Описание'
                />
            </Form.Item>
        </Form>
        
    )
}

const ProjectsList = ({deleteProjectById}) => {
    const projects = useContext(ProjectsContext)    
    return (
        <Flex
            wrap='wrap'
            gap="1%"
        >
            {projects.map(p=>
                <ProjectCard
                    key={p.id}
                    project={p}
                    deleteProjectById={deleteProjectById}
                />
            )}
        </Flex>
    )
}


const ProjectCard = ({project, deleteProjectById}) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/project/${project.id}`)
    }
    let maxTasks = getRandomInt(25);
    let doneTasks = getRandomInt(maxTasks);

    
    return (
        <Card
            title={project.name}
            extra={
                <Button
                    onClick={async (e)=>{
                        e.stopPropagation();
                        deleteProjectById(project.id);
                    }}
                >
                    <DeleteOutlined />
                </Button>
                }
            hoverable
            onClick={handleClick}
            style={{
                width: '24%',
                minWidth: '250px',
                margin: '0 0 30px 0',
            }}
        >
            {/* {project != 'Тенpор' &&
            <Flex
                align='center'
            >
                <Space
                    size={'small'}
                >
                    <ScheduleOutlined
                        style={{
                            fontSize: '25px'
                        }}
                    />                    
                        
                        <>
                        {doneTasks}/{maxTasks}   
                        </>
                      
                </Space>
            </Flex>
            } */}
        </Card>
    )
}