import { Layout, Flex, Modal, Button, message, Segmented, Card, Tag, Space, List, Avatar, Tabs, Select, Input, Form, Spin} from "antd";
import { Outlet, useLoaderData, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { get_project_link_invite } from "../Api/api";
import { ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
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
    const [isFirstLoading, setIsFirstLoading] = useState(true);

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
        messageApi.info(msg, 3.5)
    }
    const showError = (msg) => {
        messageApi.info(msg, 3.5, onclose=()=>projectStore.setExceptionMessage(null))
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

    useEffect(()=> {
        if(projectStore.exceptionMessage){
            showError(projectStore.exceptionMessage)
        }
    }, [projectStore.exceptionMessage])

    useEffect(()=> {
        if(projectStore.project)
            setIsFirstLoading(false)
    }, [projectStore.project])

    return (
            <Layout style={styles.layout}>
                {contextHolder}
                {isFirstLoading ?
                    <Flex
                        align='center'
                        justify='center'
                        style={{
                            height: '100%'
                        }}
                    >
                        <Spin size={'large'}/>
                    </Flex>
                :
                    <>
                    {projectStore.creator &&
                    <>
                        <ProjectHeader
                            openProjectSettingModal={openProjectSettingModal}
                            name={projectStore.project.name}
                            currentUserRole={projectStore.currentUserRole}
                            statuses={projectStore.statuses}
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
                                statuses={projectStore.statuses}
                                colors={projectStore.colors}
                                createStatus={projectStore.createStatus}
                                swapStatuses={projectStore.swapStatuses}
                                deleteStatus={projectStore.deleteStatus}
                            />
                        }
                    </>
                    }
                    </>
                }
            </Layout>
    )
})

export default Project;

const ProjectHeader = ({
    name,
    currentUserRole,
    openProjectSettingModal,
}) => {
    
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
    project,
    statuses,
    colors,
    createStatus,
    swapStatuses,
    deleteStatus,
}) => {
    const [currentSegment, setCurrentSegment] = useState('description')
    
    return (
        <>
            <Modal
                title='Информация о проекте'                
                centered
                open={isProjectSettingModalOpen}
                onOk={closeProjectSettingModal}
                onCancel={closeProjectSettingModal}
                width={'35%'}
                footer={[]}                
            >
                <Segmented
                    options={[
                        {label: 'описание проекта', value:"description"},
                        {label: 'участники', value:"users"},
                        {label: 'приглашение', value:"invite"},
                        {label: 'настройки', value:"settings"},
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
                    statuses={statuses}
                    colors={colors}
                    createStatus={createStatus}
                    swapStatuses={swapStatuses}
                    deleteStatus={deleteStatus}
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
    statuses,
    colors,
    createStatus,
    swapStatuses,
    deleteStatus
}) => {
    const [linkInvite, setLinkInvite] = useState(null);
    return (
        <div
            style={{
                margin: '5px 0 0 0',
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
            {segment == 'settings' &&
            <Tabs
                defaultActiveKey="1"
                tabPosition="left"
                items={[
                    {
                        label: 'Статусы',
                        key: 1,
                        children:
                            <StatusesSetting
                                statuses={statuses}
                                colors={colors}
                                createStatus={createStatus}
                                swapStatuses={swapStatuses}
                                deleteStatus={deleteStatus}
                            />
                    },
                    {
                        label: 'Тэги',
                        key: 2,
                        children: <TabsSetting/>
                    },
                ]}
            />
            }
        </div>
    )
}

const StatusesSetting = ({
    statuses,
    colors,
    createStatus,
    swapStatuses,
    deleteStatus,
}) => {
    const [isStatusCreateModalOpen, setIsStatusCreateModalOpen] = useState(false);

    const openStatusCreateModalOpen = () => {
        setIsStatusCreateModalOpen(true);
    }

    const closeStatusCreateModalOpen = () => {
        setIsStatusCreateModalOpen(false);
    }

    let sortedStatuses = [...statuses].sort((a,b)=>{
        if(a.coefficient < b.coefficient) return -1
        if(a.coefficient > b.coefficient) return 1
        return 0
    })
    let draggableStatusId = null
    return (
        <>
        <Space
            direction="vertical"
        >
            <Tag
                color="default"
                onClick={openStatusCreateModalOpen}
            >
                Добавить
            </Tag>
            <ul>
                {...sortedStatuses.map((s, index, array)=>
                    <li
                        draggable
                        onDragStart={()=>draggableStatusId = s.id}
                        onDragOver={e=>e.preventDefault()}
                        onDrop={e=>{
                            e.preventDefault()
                            swapStatuses(draggableStatusId, s.id)
                            draggableStatusId = null
                        }}
                    >
                        <Tag
                            style={{width: '100px'}}
                            color={colors.find(c=>c.id==s.color_id).name}
                        >
                            {s.name}
                        </Tag>
                        {/* {index != 0 &&
                            <Button
                                style={{width: '50px'}}
                                type='text'
                                onClick={()=>{
                                    swapStatuses(s.id, array[index-1].id)
                                }}
                            >
                                <ArrowUpOutlined />
                            </Button>
                        }
                        {array.length - 1 != index && 
                            <Button
                                style={{width: '50px'}}
                                type='text'
                                onClick={()=>{
                                    swapStatuses(s.id, array[index+1].id)
                                }}
                            >
                                <ArrowDownOutlined />
                            </Button>
                        } */}
                        <Button
                            style={{width: '50px'}}
                            type='text'
                            onClick={()=>{
                                deleteStatus(s.id);
                            }}
                        >
                            <DeleteOutlined />
                        </Button>
                    </li>
                )} 
            </ul>
        </Space>
        {isStatusCreateModalOpen && 
            <StatusCreateModal
                close={closeStatusCreateModalOpen}
                isOpen={isStatusCreateModalOpen}
                colors={colors} 
                createStatus={createStatus}
            />
        }
        </>
    );
}

const StatusCreateModal = ({
    isOpen,
    close,
    colors,
    createStatus,
}) => {
    let statusObj = {}
    return (
        <Modal
            open={isOpen}
            onOk={()=>{
                createStatus(statusObj);
                close();
            }}
            onCancel={close}
            centered
            width={400}
        >
            <Form
                onValuesChange={(_, newValues)=>{
                    statusObj = newValues
                    console.log(statusObj);
                }}
            >
                <Form.Item label='Название' name='statusName'>
                    <Input placeholder="название тега"/>
                </Form.Item>
                <Form.Item label='Цвет' name='colorId'>
                    <Select>
                        {...colors.map(c=>
                            <Select.Option value={c.id}>
                                <Tag color={c.name}>{c.name}</Tag>
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
}

const TabsSetting = () => {
    return 'tags';
}
