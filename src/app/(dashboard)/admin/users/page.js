'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, Typography, App, Modal } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userService } from '@/services/userService';
import { UserFormModal } from '@/components/users/UserFormModal';

const { Title } = Typography;


export default function UsuariosPage() {
  const { message, modal } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

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
          {status ? 'Activo' : "Inactivo"}
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
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Button
            type="link"
            size='small'
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    userList()
  }, [])

  const handleSearch = (value) => {
    setSearchText(value);
    // TODO: Implement server-side search or client-side filtering if needed
  };

  const userList = async () => {
    setLoading(true);
    try {
      const response = await userService.list()
      if (response.success) {
        setData(response.data)
      } else {
        message.error(response.error)
      }
    } catch (error) {
      message.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user) => {
    modal.confirm({
      title: '¿Estás seguro de eliminar este usuario?',
      content: `Se eliminará el usuario ${user.username}`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await userService.delete(user.id);
          if (response.success) {
            message.success(response.message);
            userList();
          } else {
            message.error(response.error || "Error al eliminar usuario");
          }
        } catch (error) {
          message.error("Error al eliminar usuario");
        }
      },
    });
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Usuarios</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
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
          rowKey={(row) => `${row.id}`}
          size='small'
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} registros`,
          }}
        />
      </Space>
      <UserFormModal
        isModalOpen={isModalOpen}
        onCancel={handleModalCancel}
        loading={loading}
        fetchUsersData={userList}
        editingUser={editingUser}
      />
    </div>
  );
}