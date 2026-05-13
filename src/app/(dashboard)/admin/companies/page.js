'use client';
import { Table, Button, Space, App, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { companyService } from '@/services/companyService';
import { CompanyFormModal } from '@/components/companies/CompanyFormModal';

export default function CompaniesPage() {
    const { message, modal } = App.useApp();
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
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
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </Space>
            ),
        },
    ];

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await companyService.get();
            if (Array.isArray(response)) {
                setData(response);
            } else if (response.results) {
                setData(response.results);
            } else if (response.data && Array.isArray(response.data)) {
                setData(response.data);
            } else {
                setData([]);
            }
        } catch (error) {
            message.error('Error al cargar empresas');
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

    const filteredData = searchText
        ? data.filter(c =>
            c.razon_social?.toLowerCase().includes(searchText.toLowerCase()) ||
            c.ruc?.includes(searchText)
        )
        : data;

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", marginBottom: 16 }}>
                <h3>Empresas</h3>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCompany(null); setIsModalOpen(true); }}>
                        Nueva Empresa
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
                rowKey="id"
                loading={loading}
                size="small"
                scroll={{ x: "max-content" }}
                pagination={{
                    pageSize: 15,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} registros`,
                }}
            />
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
