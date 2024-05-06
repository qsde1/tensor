import {
    Layout,
    Avatar,
    Image,
} from "antd";

import { Outlet } from "react-router-dom";
import { Children, useEffect, useState } from "react";
import { myBoardsContext, setMyBoardsContext } from "../contexts/boardsContext";

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

    return (
        <myBoardsContext.Provider value={myBoardsList}>
            <setMyBoardsContext.Provider value={setMyBoardsList}>
                <Layout style={styles.layout}>
                    <Layout style={styles.layout}>
                        <Layout.Content>
                            <Outlet/>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </setMyBoardsContext.Provider>
        </myBoardsContext.Provider>
    )
}

export default MainPage;