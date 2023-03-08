import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import Login from '../pages/Auth/LoginAndResgister'
// import { Link } from 'react-router-dom'

export default function PrivateRoute(props) {

    const { Component } = props;

    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated)
        return <Navigate to='atuh/login' replace={true} />

    return (
        <>
            <Component />
        </>
    )
}
