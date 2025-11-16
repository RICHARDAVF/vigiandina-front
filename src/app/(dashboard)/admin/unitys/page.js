"use client";
import React, { useEffect, useState} from 'react';
import { Table, Button, Space, Input, Typography, App } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;
import { unityService } from '@/services/unityService';
const UnitysPage = () => {
    const { message:messageApi } = App.useApp()
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [totalResults,setTotalResults] = useState(0)
    const [currectPage,setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const pageSize = 15

    useEffect(() => {
        fetchUnitys();
    }, [currectPage]);

    const fetchUnitys = async (query="") => {
        try {
            const response = await unityService.list(currectPage,pageSize,query)
            setData(response.results)
            setTotalResults(response.count)
        } catch (err) {
            messageApi.error("Error al cargar las unidades.");
        }
        setLoading(false)
    };

    const handleTableChange = ( filters, sorter) => {
    };

    const handleSearch = (value) => {
        setSearchText(value);
        // Implementar lógica de búsqueda si el backend soporta filtrado por texto
        // Por ahora, solo se actualiza el estado de búsqueda
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Unidad',
            dataIndex: 'unidad',
            key: 'unidad',
            sorter: (a, b) => a.unidad.localeCompare(b.unidad),
        },
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
    ];

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>Unidades</Title>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Nueva Unidad
                    </Button>
                </div>

                <Input
                    placeholder="Buscar unidades..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ maxWidth: 400 }}
                    allowClear
                />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={(record) => record.id}
                    loading={loading}
                    size='small'
                    pagination={{
                        current:currectPage,
                        pageSize:pageSize,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} registros`,
                    }}
                    scroll={{x:"max-content"}}
                    onChange={handleTableChange}
                />
            </Space>
        </div>
    );
};

export default UnitysPage;
