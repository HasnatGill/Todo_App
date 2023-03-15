import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Typography, Button, Table, Input, Space, Popconfirm, Modal, Form, Row, Col } from 'antd'
import ExpandedData from './ExpandedData';
import { InboxOutlined } from '@ant-design/icons';
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore/lite';
import { firestore, storage } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ReactGA from "react-ga4";


const { Title } = Typography;
const { Search, TextArea } = Input;

export default function Todolist() {

  const { user } = useContext(AuthContext)

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [todo, setTodo] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null)
  const [open, setOpen] = useState(false);
  // const [state, setState] = useState(initialState)

  const handleChange = (e) => {
    setTodo(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: acceptedFiles => { setFile(acceptedFiles[0]) }
  });


  const getTodos = useCallback(async () => {
    let array = []
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(firestore, "todos"));
      querySnapshot.forEach((doc) => {
        if (doc.data().createdBy.uid === user.uid) {
          let data = doc.data()
          data.key = data.id
          // doc.data() is never undefined for query doc snapshots
          array.push(data)
        }
      });
      setDocuments(array)
      setLoading(false)
    } catch (error) {
      console.log('error :>> ', error);
      setLoading(false)
    }
  }, [user.uid])

  useEffect(() => {
    getTodos()
  }, [getTodos])


  const columns = [
    {
      title: 'Image',
      render: (row) => <img src={row.photo?.url} alt="Avter" style={{ width: 55, height: 55 }} className="border-0 rounded-5" />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Location',
      dataIndex: 'location',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
  ];


  const handleEdit = () => {
    ReactGA.event({
      category: "Eidt",
      action: "Edit_Todos"
    })
    let eidtTodo = documents.find((doc) => doc.id === selectedRowKeys[0])
    setTodo(eidtTodo)
    setOpen(true)
  };

  const handleUpdate = async () => {

    let { title, location, description } = todo;
 
    if (title.length < 3) { return window.toastify('Enter the Title and title word should be 5', "error"); }
    if (location.length < 3) { return window.toastify('Enter the Location and location word should be 5', "error"); }
    if (description.length < 10) { return window.toastify('Enter the Description and description word should be 10', "error"); }
    if (file && file.size > 1000000) { return window.toastify("File size should be less then form 1MB", "error") }

    let formData = { ...todo }
    formData.ModifiedDate = serverTimestamp()
    formData.modifiedBy = {
      email: user.email,
      uid: user.uid
    }
    setLoading(true)
    if (file) {
      uploadFile(formData)
    } else {
      updateDocument(formData)
    }
  }

  const uploadFile = (formData) => {

    const ext = file.name.split('.').pop()
    const pathwithFileName = `${todo.id}/images/photo.${ext}`

    const fileRef = ref(storage, pathwithFileName);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on("state_changed", (snapshot) => {
      Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

    },
      (error) => {
        console.error(error)
        window.toastify("Something went wrong while uploading photo.", "error")
        setLoading(false)
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let photo = {
            url: downloadURL,
            size: file.size
          }
          formData.photo = photo
          updateDocument(formData)
        });
      }
    )
  }


  const updateDocument = async (fromData) => {
    ReactGA.event({
      category: "Delete",
      action: "Delete_Todo "
    })
    try {
      await setDoc(doc(firestore, "todos", fromData.id), fromData, { merge: true })
      window.toastify("Todo has been successfully Update", "success")
      let newDocument = documents.map((doc) => {
        if (doc.id === todo.id)
          return fromData
        return doc
      })
      setDocuments(newDocument)
      setLoading(false)
      setSelectedRowKeys([])
      setOpen(!open)
    } catch (error) {
      console.log('error', error)
      window.toastify("Something went wrong.")
      setLoading(false)
    }
  }

  const handleDelete = async () => {

    ReactGA.event({
      category: "Delete",
      action: "Delete_Todo "
    })

    for (let items of selectedRowKeys) {
      let id = { id: items }
      let DeleteTodo = documents.find((doc) => doc.id === id.id)

      setLoading(true)

      try {
        await deleteDoc(doc(firestore, "todos", DeleteTodo.id));
        let newDocument = documents.filter((item) => {
          return item.id !== DeleteTodo.id
        });

        console.log('newDocument', newDocument)
        setSelectedRowKeys([])
        setDocuments(newDocument)
        setLoading(false)
      } catch (error) {
        console.log('error', error)
      }
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasdelete = selectedRowKeys.length > 0;
  // const hasSelected = selectedRowKeys.length > 0;
  const edit = selectedRowKeys.length === 1;

  return (
    <>
      <div className='p-3 p-lg-5'>
        <div className="container bg-white py-4 px-4">
          <div className='d-flex justify-content-between align-items-center px-3 mb-3'>

            <Space className='flex-center'>
              <Title level={4} style={{ marginTop: 5 }}>Todo</Title>
              <Search placeholder='Search Todo' allowClear />
            </Space>

            <Space size='small'>
              <Button type="primary" disabled={!edit} onClick={handleEdit} >Edit</Button>
              <Popconfirm title="Confrim To Detele" okButtonProps={{ style: { background: "red" } }} onConfirm={handleDelete} onCancel={() => setSelectedRowKeys([])} okText="Delete" cancelText="Cancel">
                <Button type="primary" danger disabled={!hasdelete}>Delete</Button>
              </Popconfirm>
            </Space>

          </div>

          <Table
            dataSource={documents}
            columns={columns}
            rowSelection={rowSelection}
            loading={loading}
            bordered
            expandable={{
              expandedRowRender: (row) => <ExpandedData data={row} />,
              // rowExpandable: (row) => row.registrationNumber !== 1,
            }}
            scroll={{ x: 800 }}
            pagination={{ position: ['bottomLeft'] }}
          />

        </div>
      </div>

      <Modal
        title="UPDATE THE YOUR TODO"
        className='text-center'
        open={open} closable={false}
        confirmLoading={loading}
        onOk={handleUpdate}
        onCancel={() => { setOpen(false); setSelectedRowKeys([]) }}
        width={1000}
        okText="Update"
        cancelButtonProps={{ style: { background: "red", color: "white" } }} >

        <Form labelCol={{ xs: 6, sm: 7, md: 6 }} wrapperCol={{ xs: 18, sm: 17, md: 18 }} style={{ maxWidth: 800, marginTop: 20 }}>
          <Row gutter={[24, 24]} className="py-3">
            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Title" required><Input placeholder='Enter Title' value={todo.title} onChange={handleChange} name='title' /></Form.Item></Col>
            <Col xs={24} sm={24} md={12} xl={12}><Form.Item label="Location" required><Input placeholder='Enter Location' value={todo.location} onChange={handleChange} name='location' /></Form.Item></Col>
            <Col xs={24} sm={24} md={12} lg={12}><Form.Item label="Description" required><TextArea row={8} name='description' value={todo.description} onChange={handleChange} /> </Form.Item></Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item label="Upload Image">
                <div {...getRootProps({ className: 'dropzone' })}>
                  <InboxOutlined className='text-primary fs-2' />
                  <input {...getInputProps()} />
                  <p>Click or drag file</p>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8} lg={8}>
              <Form.Item label="Preview" className='text-center'>
                <div className="image-preview">
                  {file && <img src={URL.createObjectURL(file)} alt="Student" className='img-fluid' />}
                  {!file && <img src={`${todo.photo?.url}`} alt="Student" className='img-fluid' />}
                </div>
              </Form.Item>
            </Col>

          </Row>

        </Form>
      </Modal>
    </>
  )
}
