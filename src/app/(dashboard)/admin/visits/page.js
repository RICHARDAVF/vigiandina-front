'use client';

import { Table } from "antd";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function Visits(){
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
            title: 'Estado',
            // dataIndex: 'estado',
            key: 'status',
            render:(_,row)=>{
                if(row.estado=="3"){
                    return "FINALIZADO"
                }
                if(row.estado=="2"){
                    return "EN PROCESO"
                }
                return "PROGRAMADO"
            }
        },
        {
            title: 'Nombres y Apellidos',
            key: 'nombre',
            render:(_,row)=>(
                `${row.nombre} ${row.apellidos}`
            )
        },

        {
            title: 'DNI',
            dataIndex: 'dni',
            key: 'dni',
        },
        {
            title: 'Empresa',
            key: 'empresa',
            render:(_,row)=>((row.empresa && row.empresa.length>20)?row.empresa.slice(0,20)+'...':row.empresa),
        },
        {
            title: 'F. y H. Ingreso',
            render:(_,row)=>{
                let fulldate = ''
                if(row.fecha){
                    fulldate=fulldate+`${row.fecha}`
                }
                if(row.h_llegada){
                    fulldate=fulldate+` ${row.h_llegada}`
                }
                return fulldate
            }
            ,
            key: 'fecha_hora_ingreso',
        },
        {
            title: 'F. y H. Salida',
            render:(_,row)=>{
                let fulldate = ''
                if(row.fecha_salida){
                    fulldate=fulldate+`${row.fecha_salida}`
                }
                if(row.h_salida){
                    fulldate=fulldate+` ${row.h_salida}`
                }
                return fulldate
            },
            key: 'fecha_hora_salida',
        },
       
        
        {
            title: 'A quien visita',
            dataIndex: 'person_you_visit',
            key: 'person_you_visit',
        },
        {
            title: 'Motivo',
            dataIndex: 'motivo',
            key: 'motivo',
        },
    ];

    const fetchVisitsData = async (page) => {
        setLoading(true);
        try {
            const response = await api.get(`/v1/visits/list/?page=${page}&page_size=${pageSize}`);
            setData(response.results);
            setTotalResults(response.count);
        } catch (error) {
            console.error("Error fetching visits data:", error);
            setData([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitsData(currentPage);
    }, [currentPage]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    return (
        <div>
            <h1>Listado de Visitas</h1>
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
