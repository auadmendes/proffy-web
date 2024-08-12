//import {} from 'react-dom/client';
import {
    createBrowserRouter, 
    RouterProvider
  } from 'react-router-dom';
  

import { Landing } from './pages/Landing';
import { TeacherList } from './pages/TeacherList';
import { TeacherForm } from './pages/TeacherForm';
import { SignUp } from './pages/SignUp';
import { Login } from './pages/Login';
//import { TeacherForm } from './pages/TeacherForm';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/sign-up',
        element: <SignUp />
    },
    {
        path: '/study',
        element: <TeacherList />
    },
    {
        path: '/give-classes',
        element: <TeacherForm />
    },
]);

function Routes () {
    return (
        <RouterProvider router={router}/>
    )
}

export default Routes;