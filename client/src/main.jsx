import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App.jsx';
import Error from './pages/Error.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';

import Message from './pages/Message.jsx';

// subjects

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';

// Define the accessible routes, and which components respond to which URL
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <About />,
      },

      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },

      {
        path: '/Profile',
        element: <Profile />
      },

      {
        path: '/Message',
        element: <Message />
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
