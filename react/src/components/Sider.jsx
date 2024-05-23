import { Flex, Layout, Space, Menu, } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { itemsMenuSideBarContext } from "../contexts/boardsContext";



const Sider = ({children, width=200}) => {
    const navigate = useNavigate()
    function openSelectedDesk(e){
        navigate(`${e.item.props.path}`)
    }

const items = useContext(itemsMenuSideBarContext);

    return (
        <Layout.Sider

            width={width}
            style={{
                borderRight: '1px solid rgb(230, 230, 230)',
                padding: '0 5px'
            }}
        >
            <Menu
                mode="inline"
                onSelect={(e) => {openSelectedDesk(e)}}
                items={items}
            />
        </Layout.Sider>
    )
}

export default Sider;