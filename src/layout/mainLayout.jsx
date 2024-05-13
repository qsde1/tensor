import {
    Layout,
    Avatar,
    Image,
} from "antd";

import { Outlet } from "react-router-dom";
import { Children, useEffect, useState } from "react";
import Header from "../components/Header";
import { myBoardsContext, setMyBoardsContext, itemsMenuSideBarContext } from "../contexts/boardsContext";

// import { itemsMenuSideBarContext } from "../contexts/boardsContext";
import Sider from "../components/Sider";

//contexts

const styles = {
    layout: {
        height: '100%',
        width: '100%'
    },

    header: {
    },

    sider: {

    },

    content: {

    }
}

const myBoards = [
    {
        id: 1,
        name: 'На день рождения',
        description: 'ну типо описание такое прикольное',
    },
    {
        id: 2,
        name: 'Новоселье',
        description: 'ну типо описание такое прикольное',
    },    
]

const MainPage = () => {
    const [myBoardsList, setMyBoardsList] = useState(myBoards);


    const menuItems = [
        {
            key: 'myBoards',
            label: 'Мои доски',
            children: [
                {
                    key: 'allMyBoards',
                    label: 'Все доски',
                    path: 'boards'
                },
                ...myBoardsList.map(b => {
                    return {
                        key: `myBoards${b.id}`,
                        label: b.name,
                        path: `boards/${b.id}`
                    }
                })
            ]
        },
        {
            key: 'friendsBoards',
            label: 'Доски друзей',
            children: [
                {
                    key: 'friends1',
                    label: 'Петя Иванов- др'
                },
                {
                    key: 'friends2',
                    label: 'Родион Раскольников - на бабушкин юбилей'
                },
                {
                    key: 'friends3',
                    label: 'Соня Мармеладова- только фанс'
                },
            ]
        }
    ]


    return (
        <myBoardsContext.Provider value={myBoardsList}>
            <setMyBoardsContext.Provider value={setMyBoardsList}>
        <itemsMenuSideBarContext.Provider value={menuItems}> 
                <Layout style={styles.layout}>
                    <Header
                        style={styles.header}
                        height={80}
                    >
                        <img
                            src="logo.png"
                            style={{
                                height: '60px',                        
                            }}
                        />
                        <Avatar
                            src='https://media.tenor.com/KrKQuNciqbYAAAAM/pedro.gif'
                            size={64}
                        />
                    </Header>
                    <Layout style={styles.layout}>
                        <Sider                    
                            width={250}
                            items={menuItems}
                        />
                        <Layout.Content>
                            <Outlet/>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </itemsMenuSideBarContext.Provider>
            </setMyBoardsContext.Provider>
        </myBoardsContext.Provider>
    )
}

export default MainPage;