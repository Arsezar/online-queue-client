import { Navigate } from "react-router-dom";
import React from "react";
import Menu from "../pages/Menu";
import Login from "../pages/Login";
import Registration from "../pages/Registration";
import Profile from "../pages/Profile";
import PasswordReset from "../pages/PasswordReset";
import ForgotPassword from "../pages/ForgotPassword";

export const privateRoutes = [
    { path: '/', element: <Menu /> },
    { path: '/profile', element: <Profile /> },
    { path: '*', element: <Navigate to='/' replace /> },
]

export const publicRoutes = [
    { path: '/login', element: <Login /> },
    { path: '/registration', element: <Registration /> },
    { path: '/password-reset', element: <PasswordReset /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '*', element: <Navigate to='/login' replace /> },
]