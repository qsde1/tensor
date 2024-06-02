import { Avatar, Card, Flex, Space } from 'antd';
import { NavLink } from 'react-router-dom';
import cookie from 'cookiejs';
import { get_user_by_token } from '../Api/api';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
const Sider = () => {
    const [user, setUser] = useState(null);


    const updateUserState = async () => {
        let result = await get_user_by_token();
        if(result.status == 200){
            setUser(result.data);
        }
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
                    }}
                    bordered={false}
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
                            <NavLink
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
                            </NavLink>
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
        </>
    );
}

export default Sider;