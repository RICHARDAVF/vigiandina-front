'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Input, App } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { parkingService } from '@/services/parkingService';
import { ParkingFormModal } from '@/components/parking/ParkingFormModal';

export default function ParkingPage() {
    const { message: messageApi, modal } = App.useApp();
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParking, setEditingParking] = useState(null);
    const pageSize = 15;

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 70 },
        { title: 'Número', dataIndex: 'numero', key: 'numero' },
        { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (estado) => (
                <Tag color={estado ? 'success' : 'default'}>
                    {estado ? 'LIBRE' : 'OCUPADO'}
                </Tag>
            ),
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

    useEffect(() => {
        parkingList(searchText);
    }, [currentPage]);

    const parkingList = async (query = "") => {
        setLoading(true);
        try {
            const response = await parkingService.list(currentPage, pageSize, query);
            setData(response.results);
            setTotalResults(response.count);
        } catch {
            messageApi.error("Error al cargar parqueos");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingParking(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar este parqueo?',
            content: `Se eliminará el parqueo "${record.nombre}"`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                const response = await parkingService.delete(record.id);
                if (response.success) {
                    messageApi.success(response.message);
                    parkingList(searchText);
                } else {
                    messageApi.error(response.error);
                }
            },
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingParking(null);
    };

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Parqueos</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingParking(null); setIsModalOpen(true); }}>
                        Nuevo Parqueo
                    </Button>
                    <Input
                        placeholder="Buscar"
                        value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); parkingList(e.target.value); }}
                        style={{ width: 200 }}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(row) => `${row.id}`}
                loading={loading}
                size='small'
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalResults,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} registros`,
                }}
                scroll={{ x: "max-content" }}
                onChange={handleTableChange}
            />
            <ParkingFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onSuccess={() => parkingList(searchText)}
                editingParking={editingParking}
            />
        </div>
    );
}
