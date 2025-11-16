'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, Typography, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { areaService } from '@/services/areaService';
const { Title } = Typography;


export default function AreasPage() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [totalResults,setTotalResults] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const pageSize = 15

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'area',
      dataIndex: 'area',
      key: 'area',
    },

  ];
  useEffect(()=>{
    areaList()
  },[])
  const handleSearch = (value) => {
    setSearchText(value);
    

  };
  const areaList=async(query="")=>{
    const response = await areaService.list(currentPage,pageSize,query)
    setData(response.results)
    setTotalResults(response.count)
  }
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Usuarios</Title>
          <Button type="primary" icon={<PlusOutlined />}>
            Nuevo Usuario
          </Button>
        </div>

        <Input
          placeholder="Buscar usuarios..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
        />

        <Table
          columns={columns}
          dataSource={data}
          rowKey={(row)=>`${row.id}`}
          size='small'
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} registros`,
          }}
        />
      </Space>
    </div>
  );
}