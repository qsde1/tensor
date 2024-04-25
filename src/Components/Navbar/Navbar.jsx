import React, {useState} from 'react';
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import {SidebarData} from './SideBarData';
import './Navbar.css';
import { IconContext} from 'react-icons';

export default function Navbar({isHidden = false, handleNavbar}) {
    // const [sidebar, setSidebar] = useState(false)

    // const showSidebar = () => setSidebar(!sidebar)
    return (
        <div className='navbar'>
            <div className='navbar__container'>
                {/* <div className='navbar'>
                    <a to='#' className='menu-bars'>
                        <FaBars onClick={showSidebar} />
                    </a>
                </div> */}
                <div
                    className='navbar__container__close-button'
                    onClick={handleNavbar}
                >
                    <IoMdClose />
                </div>
                <nav className='nav-menu active'>
                    <ul className='nav-menue-items'>
                        {/* <li className='navbar-toggle'>
                            <a to="#" className='menu-bars'>
                                <IoMdClose />
                            </a>
                        </li> */}
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