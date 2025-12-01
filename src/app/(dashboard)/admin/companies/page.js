'use client';
import { Table, Button, Space, App, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { companyService } from '@/services/companyService';
import { CompanyFormModal } from '@/components/companies/CompanyFormModal';

export default function CompaniesPage() {
    const { message, modal } = App.useApp();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'RUC',
            dataIndex: 'ruc',
            key: 'ruc',
            width: 120,
        },
        {
            title: 'Razón Social',
            dataIndex: 'razon_social',
            key: 'razon_social',
        },
        {
            title: 'Abreviación',
            dataIndex: 'abreviacion',
            key: 'abreviacion',
            width: 120,
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Editar
                    </Button>
                    <Button
                        type="link"
                        size="small"
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

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await companyService.get();
            // Assuming response is an array or has a results property. 
            // Based on previous files, list endpoints might return array directly or object with data.
            // Let's assume array for now based on companyService.js implementation which returns response directly.
            // If it returns { success: true, data: [...] }, we need to adjust.
            // Checking companyService.js, it returns response.
            // Checking backend views, it uses ListAPIView which usually returns array or paginated object.
            // Let's check if it's paginated. It inherits ListAPIView but no pagination class set in view?
            // Wait, CollaboratorsListView had pagination. EmpresaListView didn't have pagination class set explicitly in the snippet I saw.
            // If no pagination, it returns array.
            if (Array.isArray(response)) {
                setData(response);
            } else if (response.results) {
                setData(response.results);
            } else if (response.data && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                // Fallback or error
                setData([]);
            }

        } catch (error) {
            message.error('Error al cargar empresas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEdit = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = (company) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar esta empresa?',
            content: `Se eliminará la empresa ${company.razon_social}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await companyService.delete(company.id);
                    if (response.success) {
                        message.success(response.message);
                        fetchCompanies();
                    } else {
                        message.error(response.error || "Error al eliminar empresa");
                    }
                } catch (error) {
                    message.error("Error al eliminar empresa");
                }
            },
        });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>Empresas</h1>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCompany(null); setIsModalOpen(true); }}>
                        Nueva Empresa
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    size="small"
                />
            </Space>
            <CompanyFormModal
                isModalOpen={isModalOpen}
                onCancel={handleModalCancel}
                loading={loading}
                fetchCompaniesData={fetchCompanies}
                editingCompany={editingCompany}
            />
        </div>
    );
}
