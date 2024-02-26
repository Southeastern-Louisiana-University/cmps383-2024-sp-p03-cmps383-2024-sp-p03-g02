import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import NavbarLayout from './routes/nav/index.tsx'
import Login from './routes/login/index.tsx'
import Home from './routes/home/index.tsx'
import Hotel from './routes/hotels/index.tsx'

const router = createBrowserRouter([
  {
    path:"",
    element: <NavbarLayout />,
    children:[
      {
        path:"/",
        element: <Home/>,
      },
      {
        path:"/Login",
        element:<Login/>,
      },
      {
        path:"/Hotels",
        element:<Hotel/>,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
