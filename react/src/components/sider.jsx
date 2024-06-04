import { Avatar, Button, Card, Flex, Input, Modal, Space } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import cookie from 'cookiejs';
import { get_user_by_token, join_user_to_project } from '../Api/api';
import { useEffect, useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
const Sider = () => {
    const [user, setUser] = useState(null);
    const [isUserSettingOpen, setIsUserSettingOpen] = useState(false)
    const navigate = useNavigate();



    const showUserSettingModal = () => {
        setIsUserSettingOpen(true)
    }
    
    const closeUserSettinModal = () => {
        setIsUserSettingOpen(false)
    }

    const logout = () => {
        cookie.remove('token');
        return navigate('/')
    }

    const updateUserState = async () => {
        let result = await get_user_by_token();
        if(result.status == 200){
            setUser(result.data);
        }
    }


    const joinProject = async (projectLink) => {
        let res = await join_user_to_project(projectLink)
        if(result.status == 200)
            return navigate('/projects')
    }

    useEffect(()=>{
        (async () => {            
            await updateUserState();
        })();
    }, []);

    return (
        <>
            <Flex
                vertical
                style={{
                    height: '100%'
                }}
            >   
                {user && 
                <>
                <Card
                    style={{
                        backgroundColor: 'inherit',
                        cursor: 'pointer'
                    }}
                    bordered={false}
                    onClick={showUserSettingModal}
                >
                    <p
                        style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            color: '#b3b9cd',
                        }}
                    >
                        <Avatar icon={<UserOutlined/>} src={user.img}/> {user.name} {user.surname}
                    </p>
                    {/* <Button onClick={logout}>
                        <LogoutOutlined/>
                    </Button> */}
                </Card>
                <Flex
                    vertical
                    justify='center'
                    align='center'
                    style={{
                        flexGrow: 1
                    }}
                >
                    <Flex
                        vertical
                        justify='space-evenly'
                        align='center'
                        style={{
                            height3: '15%',
                        }}
                    >
                        <Space
                            direction='vertical'
                            size={'large'}
                            style={{
                                color: '#b3b9cd'
                            }}
                        >
                            <NavLink
                                
                                to='/projects'
                                className={({isActive, isPending}) =>                                 
                                    isActive ?
                                    'active'
                                    : isPending ?
                                    'pending'
                                    : ''
                                }
                            >
                                Проекты
                            </NavLink>
                            {/* <NavLink
                                to='/teams'
                                className={({isActive, isPending}) =>
                                    isActive ?
                                    'active'
                                    : isPending ?
                                    'pending'
                                    : ''
                                }
                            >
                                Команды
                            </NavLink> */}
                        </Space>
                    </Flex>
                </Flex>
                </>
                }
                {!user &&
                <Flex
                    vertical
                    justify='center'
                    align='center'
                    style={{
                        flexGrow: 1
                    }}
                >
                    <Flex
                        vertical
                        justify='space-evenly'
                        align='center'
                        style={{
                            height3: '15%',
                        }}
                    >
                        <Space
                            direction='vertical'
                            size={'large'}
                            style={{
                                color: '#b3b9cd'
                            }}
                        >
                            <NavLink
                                to='/auth'
                                className={({isActive, isPending}) =>
                                    isActive ?
                                    'active'
                                    : isPending ?
                                    'pending'
                                    : ''
                                }
                            >
                                Войти
                            </NavLink>
                            <NavLink
                                to='/registration'
                                className={({isActive, isPending}) =>
                                    isActive ?
                                    'active'
                                    : isPending ?
                                    'pending'
                                    : ''
                                }
                            >
                                Регистрация
                            </NavLink>
                        </Space>
                    </Flex>
                </Flex>
                }
            </Flex>
            <UserSettingModal
                isOpen={isUserSettingOpen}
                close={closeUserSettinModal}
                joinProject={joinProject}
            />
        </>
    );
}

export default Sider;


const UserSettingModal = ({
    isOpen,
    close,
    joinProject,
}) => {
    const [link, setLink] = useState(null)
    return (
        <Modal
            title="Присоединиться к проекту"
            centered
            open={isOpen}
            onCancel={close}
            onOk={()=>{
                joinProject(link)
                close()
            }}
        >
           <Input type='text' value={link} onChange={e=>setLink(e.target.value)}/>           
        </Modal>
    )
}