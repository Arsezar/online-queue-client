import { Navigate } from "react-router-dom";
import React from "react";
import Menu from "../pages/Menu";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import UserData from "../pages/UserData";
import Profile from "../pages/Profile";
import PasswordReset from "../pages/PasswordReset";

export const privateRoutes = [
    { path: '/', element: <Menu /> },
    { path: '/profile', element: <Profile /> },
    { path: '/userdata', element: <UserData /> },
    { path: '*', element: <Navigate to='/' replace /> },
]

export const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/registration', element: <Registration /> },
    { path: '/password-reset', element: <PasswordReset /> },
    { path: '*', element: <Navigate to='/login' replace /> },
]