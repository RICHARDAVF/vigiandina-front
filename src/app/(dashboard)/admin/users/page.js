'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userService } from '@/services/userService';
import { UserFormModal } from '@/components/users/UserFormModal';

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
                const colors = { Admin: 'red', Moderador: 'blue', Usuario: 'green' };
                return <Tag color={colors[role]}>{role}</Tag>;
            },
        },
        {
            title: 'Estado',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (status) => (
                <Tag color={status ? 'success' : 'default'}>
                    {status ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="text"
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="text"
                        size='small'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    useEffect(() => {
        userList();
    }, []);

    const userList = async () => {
        setLoading(true);
        try {
            const response = await userService.list();
            if (response?.success) {
                setData(Array.isArray(response.data) ? response.data : []);
            } else if (Array.isArray(response?.results)) {
                setData(response.results);
            } else if (Array.isArray(response)) {
                setData(response);
            } else {
                message.error(response?.error || "Error al cargar usuarios");
                setData([]);
            }
        } catch (error) {
            message.error("Error al cargar usuarios");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

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

    const filteredData = searchText
        ? data.filter(u =>
            u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchText.toLowerCase())
        )
        : data;

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Usuarios</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
                        Nuevo Usuario
                    </Button>
                    <Input
                        placeholder="Buscar"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(row) => `${row.id}`}
                size='small'
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                    pageSize: 15,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} registros`,
                }}
            />
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
