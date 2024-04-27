import { useState, ReactNode } from 'react';
import './MainLayout.css'
import { IconContext} from 'react-icons';
import { IoMdClose, IoIosArrowForward } from "react-icons/io";

type MainLayoutProps = {
    header: ReactNode;
    sidebar: ReactNode;
    content: ReactNode;
}

const MainLayout = ({header,sidebar,content}: MainLayoutProps) =>{
    const [isHiddenSidebar, setHiddenSidebar] = useState<Boolean>(false);

    const toggleSidebar = ():void => {
        setHiddenSidebar(!isHiddenSidebar);
    }    
    return (
        <IconContext.Provider value={{color: 'rgb(70,137,245)', size: '1.5em'}}>
        <div className='main'>
            <div className="header">
                {/* как передать fc в jsx */}
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

export default MainLayout