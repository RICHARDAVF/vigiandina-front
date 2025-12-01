'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Typography, App, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { areaService } from '@/services/areaService';
import { AreasFormModal } from '@/components/areas/AreasFormModal';

const { Title } = Typography;

export default function AreasPage() {
  const { message } = App.useApp();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const pageSize = 15;

  useEffect(() => {
    areaList(currentPage, searchText);
  }, [currentPage]);

  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    areaList(1, value);
  };

  const areaList = async (page, query = "") => {
    setLoading(true);
    try {
      const response = await areaService.list(page, pageSize, query);
      setData(response.results);
      setTotalResults(response.count);
    } catch (error) {
      console.error(error);
      message.error("Error al cargar áreas");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingArea(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const response = await areaService.delete(id);
    if (response.success) {
      message.success(response.message);
      areaList(currentPage, searchText);
    } else {
      message.error(response.error);
    }
    setLoading(false);
  };

  const showModal = () => {
    setEditingArea(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleSuccess = () => {
    areaList(currentPage, searchText);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
    },
    {
      title: 'Área',
      dataIndex: 'area',
      key: 'area',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este área?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
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
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Áreas de Trabajo</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Nueva Área
          </Button>
        </div>

        <Input
          placeholder="Buscar áreas..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 400 }}
          allowClear
          value={searchText}
        />

        <Table
          columns={columns}
          dataSource={data}
          rowKey={(row) => `${row.id}`}
          size='small'
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalResults,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} registros`,
          }}
          onChange={handleTableChange}
        />

        <AreasFormModal
          isModalOpen={isModalOpen}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          editingArea={editingArea}
        />
      </Space>
    </div>
  );
}