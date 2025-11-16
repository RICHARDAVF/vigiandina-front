'use client';

import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Spin, Alert } from 'antd';
import { API_ENDPOINTS } from '@/utils/constants';
import { companyService } from '@/services/companyService';
import { EditOutlined,DeleteOutlined,SearchOutlined } from '@ant-design/icons';
const { Title } = Typography;

const CompaniesPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await companyService.get(API_ENDPOINTS.COMPANIES.LIST);
                setData(response.results || response); // Asumiendo que la API devuelve 'results' o directamente un array
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Error al cargar las empresas. Por favor, inténtalo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'RUC',
            dataIndex: 'ruc',
            key: 'ruc',
        },
        {
            title: 'Razón Social',
            dataIndex: 'razon_social',
            key: 'razon_social',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Abreviación',
            dataIndex: 'abreviacion',
            key: 'abreviacion',
        },
{
            title:"Acciones",
            key:"actions",
            render:(_,row)=>(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
                    <EditOutlined style={{color:"green"}}/>
                    <DeleteOutlined style={{color:"red"}}/>
                    <SearchOutlined style={{color:"blue"}}/>
                </div>
            )

        },
    ];


    return (
       <div>
        <div>
            <h3>Listado de empresas</h3>
        </div>
           <Table
               columns={columns}
               dataSource={data}
               rowKey="id" 
               pagination={{ pageSize: 10 }}
               size='small'
               scroll={{x:"max-content"}}
           />
       </div>
       
    );
};

export default CompaniesPage;
