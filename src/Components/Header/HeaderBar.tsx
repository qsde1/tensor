import './HeaderBar.css'
const HeaderBar = () => {
    return (
        <div className='headerbar'>
            <div className='headerbar__container'>
                <div className='headerbar__item'>
                    <div className='headerbar__item__logo'>
                        <img src="logo.png" alt="" />
                    </div>
                </div>
                <div className='headerbar__item'>
                    <div className='headerbar__item__user'>
                        <div className='headerbar__item__user__picture'>
                            <img src="https://media.tenor.com/KrKQuNciqbYAAAAM/pedro.gif" alt="" />
                        </div>
                        <div className='headerbar__item__user__name'>Валерия Терехина</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeaderBar