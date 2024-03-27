import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import './index.css'
import NavbarLayout from './routes/nav/index.tsx'
import Login from './routes/login/index.tsx'
import Home from './routes/home/index.tsx'
import HotelListPage from './routes/hotels/index.tsx';
import HotelDetailsPage from './routes/hotels/hotel/id/HotelDetailPage.tsx';
import RegisterPage from './routes/signUp/signUp.tsx';
import BookingPage from './routes/Booking/BookingPage.tsx'
import SearchHotels from './routes/hotels/SearchHotels.tsx'


const router = createBrowserRouter([
  {
    path: '',
    element: <NavbarLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/Hotels',
        element: <HotelListPage />,
      },
      {
        path: '/Hotels/:id',
        element: <HotelDetailsPage/>,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {path: '/booking/:id',
      element: <BookingPage />
    },
    {
      path: "/find-hotel", 
      element: <SearchHotels /> 
    }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
