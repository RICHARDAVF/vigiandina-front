'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { positionService } from '@/services/positionService';
import { PositionsFormModal } from '@/components/positions/PositionsFormModal';

const PositionsPage = () => {
    const { message } = App.useApp();
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState(null);

    useEffect(() => {
        fetchPositions(currentPage);
    }, [currentPage]);

    const fetchPositions = async (page) => {
        try {
            setLoading(true);
            const response = await positionService.get(page, pageSize);
            setPositions(response.results);
            setTotalResults(response.count);
        } catch (err) {
            message.error("Error al cargar los cargos.");
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

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
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
            title: "Área de Trabajo",
            dataIndex: ["worklace", "area"],
            key: "worklace",
            render: (_, record) => record.worklace?.area,
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="¿Estás seguro de eliminar este cargo?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Lista de Cargos de Trabajador</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Agregar Cargo
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
