import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GoogleCircleFilled, FacebookFilled } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Space, Typography } from "antd";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore/lite';
import { auth, firestore } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

const { Title } = Typography;

const initialState = {
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
}

export default function LoginAndRegister() {

    const { dispatch } = useContext(AuthContext)

    let navigate = useNavigate()

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const [type, setType] = useState("")
    const params = useParams()

    useEffect(() => {
        setType(params["*"])
    }, [params])

    const handleChange = e => {
        let { name, value } = e.target
        setState(s => ({ ...s, [name]: value }))
    }

    const handleLogin = () => {

        let { email, password } = state;

        if (email.length < 2) { return window.toastify("Please enter email", "error") }
        if (password.length < 6) { return window.toastify("Enter password minimum 6 characters", "error") }

        setIsProcessing(true)

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                let user = userCredential.user;
                console.log(user)
                navigate("/")
                // ...
            })
            .catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    window.toastify('This Email is Not Rsgister.', "error");
                } else {
                    window.toastify("Something went wrong. Please try again or contact support team.", "error")
                }
            })
            .finally(() => {
                setIsProcessing(false)
            })
    }

    const handleRegister = () => {

        let { email, password, confirmPassword } = state;

        if (email.length < 2) { return window.toastify("Please enter email", "error") }
        if (password.length < 6) { return window.toastify("Enter password minimum 6 characters", "error") }
        if (!confirmPassword) { return window.toastify("Please enter comfirm password", "error") }
        if (confirmPassword !== password) { return window.toastify("Password doesn't match.", "error") }

        setIsProcessing(true)

        createUserWithEmailAndPassword(auth, email, password, confirmPassword)
            .then((userCredential) => {
                // Signed in 
                let user = userCredential.user;
                // console.log('user', user)
                addDocument(user)
                navigate('/')
                // ...
            })
            .catch((error) => {
                if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
                    window.toastify('This is Email already exist.', "error");
                } else {
                    window.toastify("Something went wrong. Please try again or contact support team.", "error")
                }
            })
            .finally(() => {
                setIsProcessing(false)
            })

    }


    const addDocument = async (user) => {
        try {
            await setDoc(doc(firestore, "User", user.uid), {
                firstName: state.firstname,
                lastName: state.lastname,
                user: user.uid
            });
            dispatch({ type: "LOGIN" })
        } catch (error) {
            console.log('error', error)
        }
    }

    return (
        <>
            <div className='auth p-4 px-md-5 flex-center' style={{ background: "#c8c8c8", minHeight: "100vh" }}>
                <div className='p-5 bg-white w-100' style={{ minHeight: "90vh" }}>
                    <div className='p-4 p-lg-4 flex-center bg-white'>
                        <div className='form-content px-4 py-3'>
                            <Row className='mb-3'>
                                <Col span={24}>
                                    <Title level={4}>{type === "register" ? " Register for an account" : "Login"}</Title>
                                </Col>
                                <Col span={24}>
                                    <Radio.Group value={type} onChange={e => setType(e.target.value)}>
                                        <Radio value="register">I am new</Radio>
                                        <Radio value="login">I have an account</Radio>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Form>
                                <Row>
                                    {type === "register" &&
                                        <>
                                            <Col span={24}>
                                                <Form.Item>
                                                    <Input placeholder="First Name" name='firstname' onChange={handleChange} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item>
                                                    <Input placeholder="Last Name" name='lastname' onChange={handleChange} />
                                                </Form.Item>
                                            </Col>
                                        </>
                                    }
                                    <Col span={24}>
                                        <Form.Item>
                                            <Input placeholder="E-mail" name='email' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Form.Item>
                                            <Input.Password placeholder="Password" name='password' onChange={handleChange} />
                                        </Form.Item>
                                    </Col>

                                    {type === "register" &&
                                        <Col span={24}>
                                            <Form.Item>
                                                <Input.Password placeholder="Confirm password" name='confirmPassword' onChange={handleChange} />
                                            </Form.Item>
                                        </Col>
                                    }

                                    <Col span={24}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Checkbox className='mb-0'>Remember me</Checkbox>
                                            {
                                                type === "register"
                                                    ? null
                                                    : <Link to="/auth/forgot-password" className='text-decoration-none text-info'>Forgot password</Link>
                                            }
                                        </div>
                                    </Col>

                                    <Col span={24}>
                                        <p className="fw-bold my-3">OR Sign Up with</p>
                                        <Space size="small">
                                            <Button className='flex-center'><GoogleCircleFilled />Google</Button>
                                            <Button className='flex-center'><FacebookFilled />Facebook</Button>
                                        </Space>
                                    </Col>

                                    <Col span={24} className="mt-3">
                                        <Form.Item>
                                            {type === "register"
                                                ? <Button type="primary" htmlType="submit" loading={isProcessing} onClick={handleRegister}>Register</Button>
                                                : <Button type="primary" htmlType="submit" loading={isProcessing} onClick={handleLogin}>Login</Button>
                                            }

                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
