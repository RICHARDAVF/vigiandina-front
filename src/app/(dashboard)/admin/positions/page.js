'use client';

import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, Alert, Button, Space, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { positionService } from '@/services/positionService';
import { PositionsFormModal } from '@/components/positions/PositionsFormModal';

const { Title } = Typography;

const PositionsPage = () => {
    const { message } = App.useApp();
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);

    useEffect(() => {
        fetchPositions(currentPage)
    }, [currentPage]);

    const fetchPositions = async (page) => {
        try {
            setLoading(true);
            const response = await positionService.get(page, pageSize);
            setPositions(response.results);
            setTotalResults(response.count);
        } catch (err) {
            console.error("Error fetching positions:", err);
            setError("Error al cargar los cargos.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingPosition(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        const response = await positionService.delete(id);
        if (response.success) {
            message.success(response.message);
            fetchPositions(currentPage);
        } else {
            message.error(response.error);
        }
        setLoading(false);
    };

    const showModal = () => {
        setEditingPosition(null);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingPosition(null);
    };

    const handleSuccess = () => {
        fetchPositions(currentPage);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo',
        },
        {
            title:"Área de Trabajo",
            dataIndex:["worklace","area"],
            key:"worklace",
            render: (_, record) => record.worklace?.area
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                        size="small"
                    >
                        Editar
                    </Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar este cargo?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            size="small"
                        >
                            Eliminar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

   

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    return (
        <div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>Lista de Cargos de Trabajador</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    Agregar Cargo
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={positions}
                rowKey="id"
                loading={loading}
                size='small'
                scroll={{ x: "max-content" }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalResults,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} registros`,
                }}
                onChange={handleTableChange}
            />

            <PositionsFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
                editingPosition={editingPosition}
            />
        </div>
    );
};

export default PositionsPage;
