"use client";
import React, { useEffect, useState} from 'react';
import { Table, Button, Space, Input, Typography, App } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { workplaceService } from '@/services/workplaceService';
const { Title } = Typography;

const WorkplacesPage = () => {
    const { message:messageApi } = App.useApp()
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState([]);
    const [totalResults,setTotalResults] = useState(0)
    const [currectPage,setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true);
    const pageSize = 15

    useEffect(() => {
        fetchPuestos();
    }, [currectPage]);

    const fetchPuestos = async (query="") => {
        try {
            const response = await workplaceService.list(currectPage,pageSize,query)
            setData(response.results)
            setTotalResults(response.count)
        } catch (err) {
            messageApi.error("Error al cargar los puestos de trabajo.");
        }
        setLoading(false)
    };

    const handleTableChange = ( filters, sorter) => {
    };

    const handleSearch = (value) => {
        setSearchText(value);

    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
        },
        {
            title: 'Puesto',
            dataIndex: 'puesto',
            key: 'puesto',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Unidad',
            dataIndex: 'unity_name',
            key: 'unity_name',
        },
        {
            title: 'Empresa',
            dataIndex: 'company_name',
            key: 'company_name',
        },
        
    ];

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={2} style={{ margin: 0 }}>Puestos de Trabajo</Title>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Nuevo Puesto
                    </Button>
                </div>

                <Input
                    placeholder="Buscar puestos..."
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

export default WorkplacesPage;
