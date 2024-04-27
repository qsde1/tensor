import React from "react";
import { CiUser } from "react-icons/ci";
import { LuUsers2 } from "react-icons/lu";
import { SlPresent } from "react-icons/sl";
import { CiHome } from "react-icons/ci";


export const SidebarData = [
    {
        title: 'Главная',
        path: '/',
        icon: <CiHome />,
        cName: 'nav-text',
    },
    {
        title: 'Мои доски',
        path: '/my_tables',
        icon: <CiUser />,
        cName: 'nav-text',
    },

    {
        title: 'Доски друзей',
        path: '/friend_tabels',
        icon: <LuUsers2 />,
        cName: 'nav-text',
    },

    {
        title: 'Забронированные подарки',
        path: '/choise_presents',
        icon: <SlPresent />,
        cName: 'nav-text',
    }
]
