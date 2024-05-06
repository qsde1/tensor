import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { ConfigProvider } from 'antd'

import MainLayout from './layout/mainLayout'
import MyBoards from './pages/MyBoards'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: '/',
        element: <div>Главная</div>
      },
      {
        path: 'my-boards',
        element: <MyBoards/>
      },
    ]
  },
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <ConfigProvider
      theme={{
        "components": {
          "Layout": {
            "headerBg": "rgb(255, 255, 255)",
            "siderBg": "rgb(255, 255, 255)",
            "bodyBg": "rgb(255, 255, 255)"
          },
          "Menu": {
            "colorSplit": "rgba(255, 255, 255)",
          }
        }
      }}
    >
      <RouterProvider router={router}/>
    </ConfigProvider>
)
