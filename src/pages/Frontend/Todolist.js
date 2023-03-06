import React, { useEffect, useState } from 'react'
import { Typography, Button, Table, Input, Space, Popconfirm } from 'antd'
import ExpandedData from './ExpandedData';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore/lite';
import { firestore } from '../../config/firebase';

const { Title } = Typography;
const { Search } = Input;

export default function Todolist() {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(false);


  const getTodos = async () => {
    let array = []
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(firestore, "Todos"));
      querySnapshot.forEach((doc) => {
        let data = doc.data()
        data.key = data.id
        array.push(data)
      });
      setDocument(array)
      setLoading(false)
    } catch (error) {
      console.log('error :>> ', error);
      setLoading(false)
    }
  }

  useEffect(() => {
    getTodos()
  }, [])



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

  };

  const handleDelete = async () => {
    let DeleteTodo = document.find((doc) => doc.id === selectedRowKeys[0])
    setLoading(true)

    try {
      await deleteDoc(doc(firestore, "Todos", DeleteTodo.id));
      let newDocument = document.filter((doc) => {
        return doc.id !== DeleteTodo.id
      })
      setDocument(newDocument)
      setSelectedRowKeys([])
      setLoading(false)
    } catch (error) {
      console.log('error', error)
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasdelete = selectedRowKeys.length === 1;
  // const hasSelected = selectedRowKeys.length > 0;
  const edit = selectedRowKeys.length === 1;

  return (

    <div className='p-3 p-lg-5'>
      <div className="container bg-white py-4 px-4">
        <div className='d-flex justify-content-between align-items-center px-3 mb-3'>

          <Space className='flex-center'>
            <Title level={4} style={{ marginTop: 5 }}>Todo</Title>
            <Search placeholder='Search Todo' allowClear />
          </Space>

          <Space size='small'>
            <Button type="primary" onClick={handleEdit} disabled={!edit} >Edit</Button>
            <Popconfirm title="Confrim To Detele" okButtonProps={{style:{background:"red"}}} onConfirm={handleDelete} onCancel={() => setSelectedRowKeys([])} okText="Delete" cancelText="Cancel">
              <Button type="primary" danger disabled={!hasdelete}>Delete</Button>
            </Popconfirm>
          </Space>

        </div>

        <Table
          dataSource={document}
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


  )
}
