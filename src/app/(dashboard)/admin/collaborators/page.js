'use client';

import { Table } from "antd";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { EditOutlined,DeleteOutlined,SearchOutlined } from "@ant-design/icons";
export default function Collaborators(){
    const [data,setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const pageSize = 15;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Nombres y Apellidos',
            render:(_,row)=>(
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
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
        },
        {
            title: 'Cargo',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (text) => (text ? 'Activo' : 'Inactivo'),
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

    const fetchCollaboratorsData = async (page) => {
        setLoading(true);
        try {
            const response = await api.get(`/v1/collaborators/list/?page=${page}&page_size=${pageSize}`);
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

    return (
        <div>
            <h1>Listado de Colaboradores</h1>
            <Table
            columns={columns}
            dataSource={data}
            rowKey={row=>`${row.id}`}
            loading={loading}
            size="small"
            pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalResults,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} registros`, 
            }}
            scroll={{x:"max-content"}}
            onChange={handleTableChange}
            />
        </div>
    )
}
