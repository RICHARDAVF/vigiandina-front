'use client';

import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, Alert } from 'antd';
import { api } from '@/services/api';
import { API_ENDPOINTS } from '@/utils/constants';
import { positionService } from '@/services/positionService';
const { Title } = Typography;

const PositionsPage = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    useEffect(() => {
       fetchPositions(currentPage)
    }, [currentPage]);
 const fetchPositions = async (page) => {
            try {
                setLoading(true);
                const response = await api.get(`/v1/positions/list/?page=${page}&page_size=${pageSize}`);
                setPositions(response.results);
                setTotalResults(response.count) 
            } catch (err) {
                console.error("Error fetching positions:", err);
                setError("Error al cargar los cargos. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Cargo',
            dataIndex: 'cargo',
            key: 'cargo',
        },
        {
            title: 'Área de Trabajo',
            dataIndex: ['area', 'area'], // Acceder al campo 'area' dentro del objeto 'area'
            key: 'area',
        },
    ];

    

    if (error) {
        return (
            <Card>
                <Alert message="Error" description={error} type="error" showIcon />
            </Card>
        );
    }
    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };
    return (
        <Card>
            <Title level={2}>Lista de Cargos de Trabajador</Title>
            <Table
                columns={columns}
                dataSource={positions}
                rowKey="id" 
                loading={loading}
                size='small'
                scroll={{x:"max-content"}}
                            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalResults,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} registros`, 
            }}
                onChange={handleTableChange}

            />
        </Card>
    );
};

export default PositionsPage;
