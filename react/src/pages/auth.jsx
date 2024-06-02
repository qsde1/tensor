import { useState } from "react";
import {apiAxios} from '../Api/api'
import { Button, Checkbox, Form, Input, Layout, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import cookie from "cookiejs";
const styles = {
    layout: {
        height: '100%',
        width: '100%',
    },

    header:{
        borderBottom: '1px solid rgb(215, 215, 215)'
    },

    sider: {
        height: '100%',
        borderRight: '1px solid rgb(215, 215, 215)'
    },

    content: {
    }
}


const Auth = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({})

    return (
        <Layout style={styles.layout}>
            <Flex
                align="center"
                justify="center"
                style={{
                    height: '100%'
                }}
            >
                <Form
                    name="basic"
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    onValuesChange={(changedValues, allValues)=>setFormValues(allValues)}                
                >
                    <Form.Item
                        label="Логин"
                        name="login"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                    <Input.Password />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 10,
                        }}
                    >
                        <Button
                            type="primary"
                            // htmlType="submit"
                            onClick={async (e)=>{
                                e.preventDefault();
                                await apiAxios.post('/auth',{...formValues})
                                    .then(({data})=>{
                                        cookie.set(data.key, data.value)
                                        navigate('/projects')
                                    })
                                    .catch(e=>console.log(e))
                            }}
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
        </Layout>
    )
}

export default Auth