"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Input, App, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { workplaceService } from '@/services/workplaceService';
import { WorkplaceFormModal } from '@/components/workplaces/WorkplaceFormModal';

const WorkplacesPage = () => {
    const { message, modal } = App.useApp();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currectPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingWorkplace, setEditingWorkplace] = useState(null);
    const pageSize = 15;

    useEffect(() => {
        fetchPuestos(searchText);
    }, [currectPage]);

    const fetchPuestos = async (query = "") => {
        setLoading(true);
        try {
            const response = await workplaceService.list(currectPage, pageSize, query);
            setData(response.results);
            setTotalResults(response.count);
        } catch {
            message.error("Error al cargar los puestos de trabajo.");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const handleEdit = (record) => {
        setEditingWorkplace(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar este puesto?',
            content: `Se eliminará el puesto "${record.puesto}"`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                const response = await workplaceService.delete(record.id);
                if (response.success) {
                    message.success(response.message);
                    fetchPuestos(searchText);
                } else {
                    message.error(response.error);
                }
            },
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingWorkplace(null);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
        { title: 'Puesto', dataIndex: 'puesto', key: 'puesto' },
        { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
        { title: 'Unidad', dataIndex: 'unity_name', key: 'unity_name' },
        { title: 'Empresa', dataIndex: 'company_name', key: 'company_name' },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Puestos de Trabajo</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingWorkplace(null); setIsModalOpen(true); }}>
                        Nuevo Puesto
                    </Button>
                    <Input
                        placeholder="Buscar"
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); fetchPuestos(e.target.value); }}
                        style={{ width: 200 }}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.id}
                loading={loading}
                size='small'
                pagination={{
                    current: currectPage,
                    pageSize: pageSize,
                    total: totalResults,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} registros`,
                }}
                scroll={{ x: "max-content" }}
                onChange={handleTableChange}
            />
            <WorkplaceFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onSuccess={() => fetchPuestos(searchText)}
                editingWorkplace={editingWorkplace}
            />
        </div>
    );
};

export default WorkplacesPage;
