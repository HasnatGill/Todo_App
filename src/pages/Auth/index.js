import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './LoginAndResgister'
import Register from './LoginAndResgister'

export default function Index() {
    return (
        <>
            <Routes>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
            </Routes>
        </>
    )
}
