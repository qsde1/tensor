import { createContext, useState } from 'react';
import { Layout } from 'antd';
import Sider from '../components/sider';
import { Outlet, useLoaderData } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
// const { Header, Footer, Sider, Content } = Layout;
import {
    UserStoreContext
} from '../contexts'

const MainLayout = observer(() => {
    const userStore = useLoaderData();
    const styles = {
        layoutStyle: {
            height: '100%',
            width: '100%',
        },

        headerStyle:{
            borderBottom: '1px solid rgb(215, 215, 215)'
        },

        siderStyle: {
            height: '100%',
            borderRight: '1px solid rgb(215, 215, 215)'
        },

        contentStyle: {
        }
    }

    return (
        <>
        <UserStoreContext.Provider value={userStore}>
            <Layout style={styles.layoutStyle}>
                {/* <Header style={styles.headerStyle}>header</Header> */}
                <Layout>
                    <Layout.Sider style={styles.siderStyle}>
                        <Sider/>
                    </Layout.Sider>
                    <Layout.Content style={styles.contentStyle}>
                        {userStore.storeIsReady &&
                            <Outlet/>
                        }
                    </Layout.Content>
                </Layout>
            </Layout>
        </UserStoreContext.Provider>
        </>
    )
})

export default MainLayout;