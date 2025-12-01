'use client';

import { Table, App, Button, Input, Space, Modal } from "antd";
import { useState, useEffect } from "react";
import { api } from "@/services/api"; // Keep using api directly for list if preferred, or switch to service
import { collaboratorService } from "@/services/collaboratorService";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { CollaboratorFormModal } from "@/components/collaborators/CollaboratorFormModal";

export default function Collaborators() {
    const { message, modal } = App.useApp();
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollaborator, setEditingCollaborator] = useState(null);

    const pageSize = 15;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombres y Apellidos',
            render: (_, row) => (
                `${row.nombre} ${row.apellidos}`
            ),
            key: 'fullname',
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
            key: 'documento',
        },
        {
            title: 'Empresa',
            dataIndex: ['company', 'abreviacion'],
            key: 'company',
        },
        {
            title: 'Area',
            dataIndex: ['area', 'area'],
            key: 'area',
        },
        {
            title: 'Cargo',
            dataIndex: ['position', 'cargo'],
            key: 'position',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (text) => (text ? 'Activo' : 'Inactivo'),
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, row) => (
                <Space size="small">
                    <Button
                        type="link"
                        size='small'
                        onClick={() => handleEdit(row)}
                    >
                        Editar
                    </Button>
                    <Button
                        type="link"
                        size='small'
                        danger
                        onClick={() => handleDelete(row)}
                    >
                        Eliminar
                    </Button>
                </Space>
            )

        },

    ];

    const fetchCollaboratorsData = async (page) => {
        setLoading(true);
        try {
            // Using service instead of direct api call for consistency
            const response = await collaboratorService.get(page, pageSize, "");
            setData(response.results);
            setTotalResults(response.count);
        } catch (error) {
            console.error("Error fetching collaborators data:", error);
            setData([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollaboratorsData(currentPage);
    }, [currentPage]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const handleEdit = (collaborator) => {
        setEditingCollaborator(collaborator);
        setIsModalOpen(true);
    };

    const handleDelete = (collaborator) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar este colaborador?',
            content: `Se eliminará a ${collaborator.nombre} ${collaborator.apellidos}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await collaboratorService.delete(collaborator.id);
                    if (response.success) {
                        message.success(response.message);
                        fetchCollaboratorsData(currentPage);
                    } else {
                        message.error(response.error || "Error al eliminar colaborador");
                    }
                } catch (error) {
                    message.error("Error al eliminar colaborador");
                }
            },
        });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingCollaborator(null);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h1>Listado de Colaboradores</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingCollaborator(null); setIsModalOpen(true); }}>
                    Nuevo Colaborador
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowKey={row => `${row.id}`}
                loading={loading}
                size="small"
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
            <CollaboratorFormModal
                isModalOpen={isModalOpen}
                onCancel={handleModalCancel}
                loading={loading}
                fetchCollaboratorsData={fetchCollaboratorsData}
                editingCollaborator={editingCollaborator}
                currentPage={currentPage}
            />
        </div>
    )
}
