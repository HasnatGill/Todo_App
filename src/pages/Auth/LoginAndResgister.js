import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GoogleCircleFilled, FacebookFilled } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Space, Typography } from "antd";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite';
import { auth, firestore } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';


const { Title } = Typography;

const initialState = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
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

        let { email, password, confirmPassword, firstName } = state;

        if (firstName.length < 3) { return window.toastify("Please enter First Name", "error") }
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


    const addDocument = async (userCredential) => {
        let { email, uid } = userCredential;

        let user = {
            firstName: state.firstName,
            lastName: state.lastName,
            email,
            uid,
            dateCreated: serverTimestamp(),
            status: "active",
            roles: ["Customer"],
        }

        try {
            await setDoc(doc(firestore, "user", user.uid), user);
            dispatch({ type: "LOGIN", payload: { user } })
        } catch (error) {
            console.log('error', error)
        }
    }

    const registerGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                console.log('token', token)
                const user = result.user;
                console.log('user', user)
                navigate("/")
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('errorCode', errorCode)
                console.log('errorMessage', errorMessage)
                const email = error.customData.email;
                console.log('email', email)
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log('credential', credential)
                // ...
            });

    }
    const loginGoogle = () => {
        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }

    return (
        <div className='h-100 flex-center'>
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
                                        <Input placeholder="Full Name" name='firstName' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        <Input placeholder="Last Name" name='lastName' onChange={handleChange} />
                                    </Form.Item>
                                </Col>
                            </>
                        }
                        {
                            type === "login" &&
                            <>
                                <Col span={24} className="mb-3">
                                    <p className="fw-bold">Sign In with</p>
                                    <Space size="small">
                                        <Button className='flex-center' onClick={loginGoogle}><GoogleCircleFilled />Google</Button>
                                        <Button className='flex-center'><FacebookFilled />Facebook</Button>
                                    </Space>
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
                                {type === "register"
                                    ? null
                                    : <Link to="/auth/forgot-password" className='text-decoration-none text-info'>Forgot password</Link>
                                }
                            </div>
                        </Col>
                        {type === "register" &&
                            <>
                                <Col span={24}>
                                    <p className="fw-bold my-3">OR Sign Up with</p>
                                    <Space size="small">
                                        <Button className='flex-center' onClick={registerGoogle}><GoogleCircleFilled />Google</Button>
                                        <Button className='flex-center'><FacebookFilled />Facebook</Button>
                                    </Space>
                                </Col>
                            </>
                        }

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
    )
}
