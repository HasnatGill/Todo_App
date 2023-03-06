import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Login from '../pages/Auth/LoginAndResgister'
// import { Link } from 'react-router-dom'

export default function PrivateRoute(props) {

    const { Component } = props;

    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated)
        return <Login/>

    return (
        <>
            <Component />
        </>
    )
}
