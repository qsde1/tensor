import { Layout, Flex, Modal, Button, message, Segmented, Card, Tag, Space, List, Avatar} from "antd";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { get_project_by_id, get_project_creator, get_project_link_invite, get_users_by_project_id, } from "../Api/api";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import cookie from "cookiejs";
import { faker } from '@faker-js/faker';
import { observer } from "mobx-react-lite";
import {
    UserStoreContext,
    TasksListsStoreContext,
    ProjectStoreContext,
 } from "../contexts";

const { Header } = Layout;

const styles = {
    layout: {
        height: '100%',
        width: '100%',
    },

    header: {
        borderBottom: '1px solid rgb(215, 215, 215)',
        padding: '0 10px',
        height: '40px',
    },

    sider: {        
        borderRight: '1px solid rgb(215, 215, 215)',
    },

    content: {
        padding: '25px',
    }
}

const Project = observer(() => {
    const {projectStore, taskListsStore} = useLoaderData();
    const userStore = useContext(UserStoreContext)
    
    const [messageApi, contextHolder] = message.useMessage();
    const params = useParams();
    const [isProjectSettingModalOpen, setIsProjectSettingModalOpen] = useState(false)
    // const project = useLoaderData();
    // const [project, setProject] = useState();
    // const [creator, setCreator] = useState(null);

    // const updateCreator = async () => {
    //     let result = await get_project_creator(params.projectId)
    //     if(result.status == 200  && result.data)
    //         setCreator(result.data)
    // }
    

    const openProjectSettingModal = () => {
        setIsProjectSettingModalOpen(true);
    }

    const closeProjectSettingModal = () => {
        setIsProjectSettingModalOpen(false);
    }

    const test = () => {
        return params
    }

    const showMessage = (msg) => {
        messageApi.info(msg, 1.2)
    }

    useEffect(() => {
        projectStore.connect();
        return () => projectStore.close();
    }, [])

    useEffect(()=>{
        if(projectStore.isStoreReady){
            projectStore.getProject();
            projectStore.getCreator();
            projectStore.getCurrentUserRole();
            projectStore.getUsers();
            projectStore.getStatuses();
            projectStore.getColors();
        }
    }, [projectStore.isStoreReady])

    return (
        // <ProjectContext.Provider value={{
        //     project,
        //     creator,
        //     user,
        //     openProjectSettingModal,
        //     closeProjectSettingModal,
        //     isProjectSettingModalOpen,
        //     showMessage,
        // }}>
            <Layout style={styles.layout}>
                {contextHolder}
                {!projectStore.project ?
                    <>
                        <div>данного проекта не существует</div>
                    </>
                :
                    <>
                    {projectStore.creator &&
                    <>
                        <ProjectHeader
                            openProjectSettingModal={openProjectSettingModal}
                            name={projectStore.project.name}
                            currentUserRole={projectStore.currentUserRole}
                        />
                        <Layout style={styles.layout}>
                            <ProjectStoreContext.Provider value={projectStore}>
                                <TasksListsStoreContext.Provider value={taskListsStore}>
                                    <Outlet/>
                                </TasksListsStoreContext.Provider>
                            </ProjectStoreContext.Provider>
                        </Layout>
                        {isProjectSettingModalOpen && 
                            <ProjectInfoModal
                                closeProjectSettingModal={closeProjectSettingModal}
                                creator={projectStore.creator}
                                project={projectStore.project}
                                isProjectSettingModalOpen={isProjectSettingModalOpen}
                                showMessage={showMessage}
                                users={projectStore.users}
                            />
                        }
                    </>
                    }
                    </>
                }
            </Layout>
        // </ProjectContext.Provider>
    )
})

export default Project;

const ProjectHeader = ({
    name,
    currentUserRole,
    openProjectSettingModal
}) => {
    // const {
    //     project,
    //     creator,
    //     user,
    //     openProjectSettingModal,
    // } = useContext(ProjectContext);

    // const creatorId = creator.id
    return (
        <Header style={styles.header}>
            <Flex
                style={{
                    height: '100%',
                }}
                align="center"
            >
                <p>{name}</p>
                {currentUserRole == 'creator' &&
                <Button type="text"
                    onClick={openProjectSettingModal}
                >
                    <SettingOutlined />
                </Button>
                }
            </Flex>
        </Header>
    )
}

const ProjectInfoModal = ({
    isProjectSettingModalOpen,
    closeProjectSettingModal,
    showMessage,
    users,
    creator,
    project
}) => {
    // const {
    //     isProjectSettingModalOpen,
    //     closeProjectSettingModal,
    //     project,
    //     showMessage
    // } = useContext(ProjectContext);
    // const [creator, setCreator] = useState(null);
    const [currentSegment, setCurrentSegment] = useState('description')

    // const updateCreator = async () => {
    //     let result = await get_project_creator(project.id)
    //     if(result.status == 200  && result.data)
    //         setCreator(result.data)        
    // }

    

    const close = async () => {
        closeProjectSettingModal();
    }

    // useEffect(()=>{
    //     (async ()=>{
    //         await updateCreator();
    //     })()
    // }, [])
    
    return (
        <>
            <Modal
                title='Информация о проекте'
                centered
                open={isProjectSettingModalOpen}
                onOk={()=>{
                    close();
                }}
                onCancel={()=>{                    
                    close();
                }}
                width={'30%'}
                footer={[]}
            >
                <Segmented
                    options={[
                        {label: 'описание проекта', value:"description"},
                        {label: 'участники', value:"users"},
                        {label: 'приглашение', value:"invite"}
                    ]}
                    block
                    onChange={(value)=>setCurrentSegment(value)}
                />
                <ProjectSettingModalSegment
                    segment={currentSegment}
                    users={users}
                    project={project}
                    showMessage={showMessage}
                    creator={creator}
                />
            </Modal>
        </>
    )
}


const ProjectSettingModalSegment = ({
    segment,
    users,
    project,
    showMessage,
    creator,
}) => {    
    const [linkInvite, setLinkInvite] = useState(null);
    // const [users, setUsers] = useState([
    //     {name: 'Андрей', role:'user', url:faker.image.urlLoremFlickr({ category: 'people' })},
    //     {name: 'Кристина', role:'admin', url:faker.image.urlLoremFlickr({ category: 'people' })},
    //     {name: 'Олег', role:'user', url:faker.image.urlLoremFlickr({ category: 'people' })},
    //     {name: 'Егор', role:'admin', url:faker.image.urlLoremFlickr({ category: 'people' })},
    //     {name: 'Виктор', role:'user', url:faker.image.urlLoremFlickr({ category: 'people' })},
    //     {name: 'Алена', role:'user', url:faker.image.urlLoremFlickr({ category: 'people' })},
    // ]);

    // const updateUsers = async () => {
    //     let result = await get_users_by_project_id(project.id)
    //     if(result.status == 200  && result.data)
    //         setUsers(result.data)        
    // }

    
    // useEffect(()=>{
    //     if(segment == 'users'){
    //         console.log('change segment');
    //         (async ()=>{
    //             // await updateUsers();
    //         })()
    //     }
    // }, [segment]);

    return (
        <div
            style={{
                margin: '5px 0 0 0'
            }}
        >
            {segment == 'description' &&
            <Space
                direction="vertical"
                size={"small"}
            >
                
                <p>Название: {project.name}</p>
                <p>Владелец: {creator.name} {creator.surname[0]?.toUpperCase() + '.'}</p>
                <p>Описание: {project.description ? project.description : 'у проекта нет описания'}</p>

            </Space>
            }
            {segment == 'users' &&
                <>
                {users &&
                <>
                    <p>Участники:</p>
                    
                    <List
                        dataSource={users}
                        renderItem={u=>(
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar icon={<UserOutlined/>} src={u.url}/>}                                    
                                    title={u.name}
                                    description={u.role}
                                >
                                </List.Item.Meta>
                                {/* {u.login} */}
                            </List.Item>
                        )}
                    />
                </>
                }
                </>
            }
            {segment == 'invite' && 
            <Flex
                vertical
                align="center"
                style={{                    
                }}
            >
                <Space                    
                    size={"middle"}
                    direction="vertical"
                    align="center"
                >
                <Button
                    onClick={async ()=>{
                        let result = await get_project_link_invite(project.id);
                        if(result.status == 200)
                            setLinkInvite(result.data)
                        else
                        showMessage('Не удалось создать ссылку')
                    }}
                >
                    Создать ссылку-приглашение
                </Button>
                {linkInvite && 
                <CopyToClipboard
                    text={linkInvite}
                    onCopy={()=>showMessage('Ссылка скопирована')}
                >
                    <Tag
                        color="green"
                        style={{
                            fontSize: 15,
                            cursor: 'pointer'
                        }}
                        onClick={()=>{
                            document.cop
                        }}                    
                    >
                        {linkInvite}
                    </Tag>
                </CopyToClipboard>
                }
                </Space>
            </Flex>
            }
        </div>
    )
}