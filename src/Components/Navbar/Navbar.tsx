import React from 'react';
import {SidebarData} from './SideBarData';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='navbar__container'>
                <nav className='nav-menu active'>
                    <ul className='nav-menue-items'>
                        {SidebarData.map((item, index) => 
                            (
                                <li key={index} className={item.cName}>
                                    <a href={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </a>
                                </li>
                            )
                        )}
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navbar