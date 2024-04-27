import React from 'react';
import { IoMdClose } from "react-icons/io";
import {SidebarData} from './SideBarData';
import './Navbar.css';

export default function Navbar() {
    return (
        <div className='navbar'>
            <div className='navbar__container'>
                <nav className='nav-menu active'>
                    <ul className='nav-menue-items'>
                        {SidebarData.map((item, index) => {
                            return(
                                <li key={index} className={item.cName}>
                                    <a to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    )
}