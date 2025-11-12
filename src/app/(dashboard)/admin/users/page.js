'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, Typography, message } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userService } from '@/services/userService';
const { Title } = Typography;


export default function UsuariosPage() {
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const colors = {
          Admin: 'red',
          Moderador: 'blue',
          Usuario: 'green',
        };
        return <Tag color={colors[role]}>{role}</Tag>;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (status) => (
        <Tag color={status ? 'success' : 'default'}>
          {status?'Activo':"Inactivo"}
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
            icon={<EditOutlined />}
            onClick={() => console.log('Editar', record)}
          >
            Editar
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log('Eliminar', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(()=>{
    userList()
  },[])
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = mockData.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.email.toLowerCase().includes(value.toLowerCase())
    );
    setData(filtered);
  };
  const userList=async()=>{
    const response = await userService.list()
    if(response.success){
      setData(response.data)
    }else{
      message.error(response.error)
    }
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
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} registros`,
          }}
        />
      </Space>
    </div>
  );
}