import React, { useState } from 'react'
import { Typography, Button, Table, Input, Space } from 'antd'
import ExpandedData from './ExpandedData';

const { Title } = Typography;
const { Search } = Input;

export default function Todolist() {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'Image',
      render: (item, row) => <img src='https://i.pinimg.com/originals/65/70/0a/65700a980202957502cf0ccf524a3897.jpg' alt="Avter" style={{ width: 55, height: 55 }} className="border-0 rounded-5" />,
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

  const data = [];
  for (let i = 0; i < 2; i++) {
    data.push({
      key: i,
      title: `Title`,
      location: "Location",
      description: "This is discription This is discription This is discription",
    });
  }

  const handleEdit = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (

    <div className='p-3 p-lg-5'>
      <div className="container bg-white py-4 px-4">
        <div className='d-flex justify-content-between align-items-center px-3 mb-3'>

          <Space className='flex-center'>
            <Title level={4} style={{ marginTop: 5 }}>Todo</Title>
            <Search placeholder='Search Todo' allowClear />
          </Space>

          <Space size='small'>
            <span style={{ marginLeft: 8, }}>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}</span>
            <Button type="primary" onClick={handleEdit} loading={loading}>Edit</Button>
            <Button type="primary" danger onClick={handleDelete} disabled={!hasSelected} loading={loading}>Delete</Button>
          </Space>

        </div>

        <Table
          dataSource={data}
          columns={columns}
          rowSelection={rowSelection}
          bordered
          expandable={{
            expandedRowRender: (row) => <ExpandedData data={row} />,
            // rowExpandable: (row) => row.registrationNumber !== 1,
          }}
          scroll={{ x: 800 }}
          pagination={{position:['bottomLeft']}}
        />

      </div>
    </div>


  )
}
