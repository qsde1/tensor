import React from 'react';
import { IoMdClose } from "react-icons/io";
import {SidebarData} from './SideBarData';
import './Navbar.css';

export default function Navbar({isHidden = false, handleNavbar}) {
    return (
        <div className='navbar'>
            <div className='navbar__container'>                
                <div
                    className='navbar__container__close-button'
                    onClick={handleNavbar}
                >
                    <IoMdClose />
                </div>
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