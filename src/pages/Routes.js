import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../component/PrivateRoute'
// import { AuthContext } from '../context/AuthContext'
import Auth from './Auth'
import Frontend from './Frontend'

export default function Index() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/*" element={<PrivateRoute Component={Frontend} />} />
                <Route path='/auth/*' element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}
