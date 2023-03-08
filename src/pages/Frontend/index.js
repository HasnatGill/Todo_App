import React, { useContext } from 'react'
import { MenuOutlined, HomeFilled, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography, Button } from 'antd';
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Home'
import Todolist from './Todolist'
import { AuthContext } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
const { Content, Footer, Sider } = Layout;
const { Title } = Typography;

export default function Frontend() {

    const { dispatch} = useContext(AuthContext)

    let navigate = useNavigate()
   
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                dispatch({ type: "LOGOUT" })
                navigate('auth/login')
            })
            .catch((e) => {
                console.log('e', e)
            })
    }

    const menu = [
        { label: <Link to="/" className='text-decoration-none'>Home</Link>, key: "1", icon: <HomeFilled /> },
        { label: <Link to="/todolist" className='text-decoration-none'>Todo List</Link>, key: "2", icon: <MenuOutlined /> },
        { label: <Button type='link' className='flex-center px-0' style={{ color: "inherit" }} onClick={handleLogout} ><LogoutOutlined /> Logout</Button>, key: "3" },
    ]

    return (
        <Layout>
            <Sider breakpoint="lg" collapsedWidth={"0"} >
                <Title level={2} className="text-white fs-4 p-3">Hasnat Majid</Title>
                <Menu theme="dark" mode="inline" className='py-5 py-lg-0' items={menu} />
            </Sider>
            <Layout>

                <Content style={{ background: "#c8c8c8" }}>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path='todolist' element={<Todolist />} />
                    </Routes>
                </Content>

                <Footer className='text-center py-2 text-dark fw-bold' style={{ background: "#c8c8c8" }}>Created &copy;{window.year} By 🖤Hasnat Majid</Footer>
            </Layout>
        </Layout>
    )
}


