import React, { useContext, useState } from 'react'
import { Col, Form, Input, Row, Typography, Button } from 'antd'
import { useDropzone } from 'react-dropzone';
import { InboxOutlined } from '@ant-design/icons';
// import { AuthContext } from '../../context/AuthContext'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore/lite';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from '../../config/firebase';

const { Title } = Typography
const { TextArea } = Input

const initialState = { title: "", location: "", description: "" }

export default function Home() {

    // const { user } = useContext(AuthContext)

    const [state, setState] = useState(initialState)
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setState(s => ({ ...s, [e.target.name]: e.target.value }))
    }

    const handleSubmit = () => {



        let { title, location, description } = state;
        title = title.trim()
        location = location.trim()
        description = description.trim()

        if (title.length < 3) {
            return window.toastify('Enter the Title and title word should be 5', "error");
        }
        if (location.length < 3) {
            return window.toastify('Enter the Location and location word should be 5', "error");
        }
        if (description.length < 10) {
            return window.toastify('Enter the Description and description word should be 10', "error");
        }
        if (!file.name) {
            return window.toastify('Upload', "error");
        }
        let formData = {
            title, location, description,
            id: window.getRandomId(),
            status: "active",
            dateCreated: serverTimestamp(),
        }

        setIsLoading(true)
        if (file) {
            uploadFile(formData)
        } else {
            createDoc(formData);
        }
    }

    const uploadFile = (formData) => {

        const ext = file.name.split('.').pop()
        const pathwithFileName = `Todos/${formData.id}/images/photo.${ext}`

        const fileRef = ref(storage, pathwithFileName);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on("state_changed", (snapshot) => {
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

        },
            (error) => {
                console.error(error)
                window.toastify("Something went wrong while uploading photo.", "error")
                setIsLoading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    let photo = { url: downloadURL, size: file.size }
                    createDoc({ ...formData, photo })
                });
            }
        )
    }


    const createDoc = async (formData) => {
        try {
            await setDoc(doc(firestore, "Todos", formData.id), formData)
            setFile(null)
            setIsLoading(false)
            setState(initialState)
            window.toastify("A new Todos has been successfully added", "success")
        } catch (error) {
            window.toastify("Something went wrong while creating document.")
        }
    }


    // DropZone

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        multiple: false,
        onDrop: acceptedFiles => { setFile(acceptedFiles[0]) }
    });

    return (

        <div className='p-3 p-lg-5'>
            <div className="container bg-white p-4 p-lg-5">

                <Row className='text-center'>
                    <Col span={24}><Title level={1}>Add Todo</Title></Col>
                </Row>

                <div className='flex-center'>
                    <Form labelCol={{ xs: 6, sm: 7, md: 6 }} wrapperCol={{ xs: 18, sm: 17, md: 18 }} style={{ maxWidth: 800, }}>

                        <Row gutter={[24, 24]} className="py-3">
                            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Title" required><Input placeholder='Enter Title' name='title' value={state.title} onChange={handleChange} /></Form.Item></Col>
                            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Location" required><Input placeholder='Enter Location' name='location' value={state.location} onChange={handleChange} /></Form.Item></Col>
                            <Col xs={24} sm={24} md={12} lg={12}><Form.Item label="Description" required><TextArea row={8} name='description' value={state.description} onChange={handleChange} /> </Form.Item></Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <Form.Item label="Upload Image">
                                    <div {...getRootProps({ className: 'dropzone' })}>
                                        <InboxOutlined className='text-primary fs-2' />
                                        <input {...getInputProps()} />
                                        <p>Click or drag file</p>
                                    </div>
                                </Form.Item>
                            </Col>
                            {file &&
                                <Col xs={24} md={8} lg={8}>
                                    <Form.Item label="Preview" className='text-center'>
                                        <div className="image-preview"><img src={URL.createObjectURL(file)} alt="Student" className='img-fluid rounded-1' /></div>
                                    </Form.Item>
                                </Col>
                            }
                        </Row>

                        <Row className='text-center py-3'>
                            <Col span={24}><Button type='primary' onClick={handleSubmit} loading={isLoading}>Add Todo</Button></Col>
                        </Row>

                    </Form>
                </div>

            </div>
        </div >

    )
}