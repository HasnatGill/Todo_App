import React, { useState } from 'react'
import { Col, Form, Input, Row, Typography, Button } from 'antd'
import { useDropzone } from 'react-dropzone';
import { InboxOutlined } from '@ant-design/icons';

const { Title } = Typography
const { TextArea } = Input

const initialState = { title: "", location: "", descripation: "" }

export default function Home() {

    const [state, setState] = useState(initialState)
    const [file, setFile] = useState(null)

    const handleChange = (e) => {
        setState(s => ({ ...s, [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('state', state)
        console.log('file', file)
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
                            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Title" required><Input placeholder='Enter Title' name='title' onChange={handleChange} /></Form.Item></Col>
                            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Location" required><Input placeholder='Enter Location' name='location' onChange={handleChange} /></Form.Item></Col>
                            <Col xs={24} sm={24} md={12} lg={12}><Form.Item label="Description" required><TextArea row={8} name='descripation' onChange={handleChange} /> </Form.Item></Col>
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
                                <Col md={12} xl={12}>
                                    <Form.Item label="Preview" className='text-center'>
                                        <div className="image-preview"><img src={URL.createObjectURL(file)} alt="Student" className='img-fluid rounded-1' /></div>
                                    </Form.Item>
                                </Col>
                            }
                        </Row>

                        <Row className='text-center py-3'>
                            <Col span={24}><Button type='primary' onClick={handleSubmit}>Add Todo</Button></Col>
                        </Row>

                    </Form>
                </div>

            </div>
        </div >

    )
}