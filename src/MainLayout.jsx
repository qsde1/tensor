import './MainLayout.css'
import { useState } from 'react';
import { IconContext} from 'react-icons';
import { IoMdClose, IoIosArrowForward } from "react-icons/io";

const MainLayout = ({header, sidebar, content}) => {
    const [isHiddenSidebar, setHiddenSidebar] = useState(false);

    const toggleSidebar = () => {
        setHiddenSidebar(!isHiddenSidebar);
    }

    return (
        <IconContext.Provider value={{color: 'rgb(70,137,245)', size: '1.5em'}}>
        <div className='main'>
            <div className="header">
                {header}
            </div>
            <div className="container">                    
                {sidebar &&
                    <>
                        {isHiddenSidebar &&
                            <div
                                className='container__open-sidebar-button'
                                onClick={toggleSidebar}
                            >
                                <IoIosArrowForward />
                            </div>
                        }                            
                        {!isHiddenSidebar &&
                            <div className="sidebar">
                                {sidebar}
                                <div
                                    className='container__close-sidebar-button'
                                    onClick={toggleSidebar}
                                >
                                    <IoMdClose />
                                </div>
                            </div>
                        }
                    </>
                }
                <div className="content">
                    {content}
                </div>
            </div>
        </div>
        </IconContext.Provider>
    )
}

export default MainLayout;