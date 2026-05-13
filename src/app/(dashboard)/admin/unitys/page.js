"use client";
import React, { useEffect, useState } from 'react';
import { Table, Button, Input, App, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { unityService } from '@/services/unityService';
import { UnityFormModal } from '@/components/unitys/UnityFormModal';

const UnitysPage = () => {
    const { message, modal } = App.useApp();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currectPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUnity, setEditingUnity] = useState(null);
    const pageSize = 15;

    useEffect(() => {
        fetchUnitys(searchText);
    }, [currectPage]);

    const fetchUnitys = async (query = "") => {
        setLoading(true);
        try {
            const response = await unityService.list(currectPage, pageSize, query);
            setData(response.results);
            setTotalResults(response.count);
        } catch {
            message.error("Error al cargar las unidades.");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const handleEdit = (record) => {
        setEditingUnity(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar esta unidad?',
            content: `Se eliminará la unidad "${record.unidad}"`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                const response = await unityService.delete(record.id);
                if (response.success) {
                    message.success(response.message);
                    fetchUnitys(searchText);
                } else {
                    message.error(response.error);
                }
            },
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingUnity(null);
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
        { title: 'Unidad', dataIndex: 'unidad', key: 'unidad', sorter: (a, b) => a.unidad.localeCompare(b.unidad) },
        {
            title: 'Empresa',
            dataIndex: ['empresa', 'razon_social'],
            key: 'empresa',
            render: (empresa) => empresa || 'N/A',
        },
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
                <h3>Unidades</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUnity(null); setIsModalOpen(true); }}>
                        Nueva Unidad
                    </Button>
                    <Input
                        placeholder="Buscar"
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); fetchUnitys(e.target.value); }}
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
            <UnityFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onSuccess={() => fetchUnitys(searchText)}
                editingUnity={editingUnity}
            />
        </div>
    );
};

export default UnitysPage;
