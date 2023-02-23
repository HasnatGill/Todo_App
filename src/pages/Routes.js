import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Auth from './Auth'
import Frontend from './Frontend'

export default function Index() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/*' element={<Frontend />} />
                <Route path='/auth/*' element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}
