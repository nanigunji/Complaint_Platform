import React from 'react'
import { createBrowserRouter,Navigate,RouterProvider } from 'react-router-dom';
import Home from './components/Home/Home'
import RootLayout from './RootLayout';
import Login from './components/Login/Login';
import ComplaintForm from './components/ComplaintForm/ComplaintForm'
import AdminPage from './components/AdminPage/AdminPage';

function App() {
  let router=createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      children:[
        {
          path:'home',
          element:<Home/>
        },{
          path:'login',
          element:<Login/>
        },{
          path:'complaint-form',
          element:<ComplaintForm/>
        },{
          path:'adminpage',
          element:<AdminPage/>
        }
      ]
    }
  ])
  return (
    <div>

<RouterProvider router={router}/>
    </div>
  )
}

export default App