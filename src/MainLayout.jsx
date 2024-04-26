import { Component, cloneElement, renderItem } from 'react';
import './MainLayout.css'
import MyBoards from './Components/MyBoards/MyBoards'
import Navbar from './Components/Navbar/Navbar';
import HeaderBar from './Components/Header/HeaderBar';
import { IconContext} from 'react-icons';
import { IoMdClose, IoIosArrowForward } from "react-icons/io";

export default class MainLayout extends Component {
    state = {
        isHiddenSidebar: false
    }

    toggleSidebar = () => {
        this.setState({isHiddenSidebar:!this.state.isHiddenSidebar});
    }

    render(){
        return (
            <IconContext.Provider value={{color: 'rgb(40,176,217)', size: '1.5em'}}>
            <div className='main'>
                <div className="header">
                    {this.props.header}
                </div>
                <div className="container">                    
                    {this.props.sidebar &&
                        <>
                            {this.state.isHiddenSidebar &&
                                <div
                                    className='container__open-button'
                                    onClick={this.toggleSidebar}
                                >
                                    <IoIosArrowForward />
                                </div>
                            }
                            {!this.state.isHiddenSidebar &&
                                <div className="sidebar">
                                    {/* {не знаю как правильно передать props в компоненту, полученную из props, поэтому использую cloneElement} */}
                                    {cloneElement(this.props.sidebar,{isHidden:this.state.isHiddenSidebar, handleNavbar:this.toggleSidebar})}
                                </div>
                            }
                        </>
                    }
                    <div className="content">
                        {this.props.content}
                    </div>
                </div>
            </div>
            </IconContext.Provider>
        )
    }
}