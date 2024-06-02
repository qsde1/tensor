import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import { ConfigProvider } from 'antd';

import MainLayout from './layouts/mainLayout.jsx'
import Projects from './pages/projects.jsx';
import Project from './pages/project.jsx';

import Backlog from './components/backlog.jsx';
import TasksList from './components/tasks.jsx';

import cookie from 'cookiejs';
import Auth from './pages/auth.jsx';
import Registration from './pages/registration.jsx';
import { get_backlog_by_project_id, reset, updateUserCookie } from './Api/api.js';
import Invite from './components/invite.jsx';
import ProjectStore from './store/project-store.js';
import UserStore from './store/user-store';
import TaskListsStore from './store/tasksLists-store.js';
import TasksStore from './store/tasks-store.js';
// import { projectsLoader, projectLoader, backlogLoader, tasksLoader } from './loaders/projectsLoader.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    loader: async () => {
      await updateUserCookie();
      let userStore = new UserStore();
      return userStore;
    },
    
    children: [
      {
        path: '/projects',
        element: <Projects/>,
      },
      {
        path: '/join/:link',
        element: <Invite/>,
      },
      {
        path: '/project/:projectId',
        element: <Project/>,
        loader: async ({params}) => {
          let projectStore = new ProjectStore(params.projectId)
          let result = await get_backlog_by_project_id(params.projectId);
          let taskListsStore = new TaskListsStore(result.data.id);
          return {taskListsStore, projectStore}
        },
        
        children: [
          {
            path: '',
            element: <Backlog/>,
            // loader: async ({params}) => {
            //   let result = await get_backlog_by_project_id(params.projectId);
            //   let taskListsStore = new TaskListsStore(result.data.id);
            //   return taskListsStore
            // },
            children: [
              {
                path: '',
                element: <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  Список задач не выбран
                </div>,
              },
              {
                path: `backlog/:tasksListId`,
                element: <TasksList/>,
                loader: ({params})=>{
                  let tasksStore = new TasksStore(params.tasksListId);
                  return tasksStore;
                }
              }
            ]
          },          
        ]
      }
    ]
  },
  {
    path: '/registration',
    element: <Registration/>,
    loader: () => {
      let userIdFromCookie = cookie.get('user_id');

      if(userIdFromCookie !== false){    
        return redirect('/projects');
      }

      return userIdFromCookie;
    },
  },
  {
    path: '/auth',
    element: <Auth/>,
    loader: () => {
      let userIdFromCookie = cookie.get('user_id');

      if(userIdFromCookie !== false){    
        return redirect('/projects');
      }

      return userIdFromCookie;
    },
  },
  {
    path: '/reset',
    loader: async () => {
      await reset();
      return redirect('/projects')
    },
    element: <div></div>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        "components": {
          "Layout": {
            "headerBg": "rgb(255, 255, 255)",
            "siderBg": "#0b0f1f",
            "bodyBg": "rgb(255, 255, 255)",
            "headerPadding": "0"
          },
          "Card": {
            "colorBorderSecondary": "rgb(129, 129, 129)"
          },
        },
        "token": {
          "colorPrimary": "#97a1ae",
          "colorInfo": "#97a1ae"
        }
      }}
    >
      <RouterProvider router={router}/>
    </ConfigProvider>
  </React.StrictMode>,
)