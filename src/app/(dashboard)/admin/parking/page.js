'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Space, Tag, Input,  App } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { parkingService } from '@/services/parkingService';


export default function ParkingPage() {
  const [searchText, setSearchText] = useState('');
  const {message:messageAPi} = App.useApp()
  const [data, setData] = useState([]);
  const [totalResults,setTotalResults] = useState(0)
  const [currentPage,setCurrentPage] = useState(1)
  const pageSize = 15
  const columns = useMemo(()=>[
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Número',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    
    {
      title: 'Estado',
      key: 'estado',
      render: (estado) => (
        <Tag color={estado ? 'success' : 'default'}>
          {estado?'LIBRE':"OCUPADO"}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size='small'
            icon={<EditOutlined />}
            onClick={() => console.log('Editar', record)}
          >
            Editar
          </Button>
          <Button
            type="link"
            size='small'
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('Eliminar', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ]);
  useEffect(()=>{
    parkingList()
  },[currentPage])
  const handleSearch = (value) => {
   
    setData(filtered);
  };
  const parkingList=async(query="")=>{
    const response = await parkingService.list(currentPage,pageSize,query)
    setData(response.results)
    setTotalResults(response.count)
  }
const handleTableChange = async(pagination) => {
        setCurrentPage(pagination.current);
    };
  return (
    <div >
        <div>
            <Input
            placeholder="Buscar usuarios..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 400 }}
            allowClear
            />
        </div>       

        <Table
          columns={columns}
          dataSource={data}
          rowKey={(row)=>`${row.id}`}
          size='small'
          pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalResults,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} registros`,
            }}
        onChange={handleTableChange}
        />
    </div>
  );
}