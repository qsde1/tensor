import React from 'react'
import ReactDOM from 'react-dom/client'
import MainLayout from './MainLayout'
import MyBoards from './Components/MyBoards/MyBoards'
import Navbar from './Components/Navbar/Navbar';
import HeaderBar from './Components/Header/HeaderBar';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainLayout
      header={<HeaderBar/>}
      sidebar={<Navbar/>}
      content={<MyBoards/>}
    />
  </React.StrictMode>,
)
