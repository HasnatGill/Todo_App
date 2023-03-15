import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

export default function PrivateRoute(props) {

    const { Component } = props;

    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated)
        return <Navigate to='auth/login' replace={true} />

    return (
        <>
            <Component />
        </>
    )
}
