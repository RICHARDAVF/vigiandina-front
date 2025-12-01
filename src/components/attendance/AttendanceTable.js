'use client';
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { attendanceService } from "@/services/attendanceService";

const AttendanceTable = ({ 
    data, 
    loading, 
    currentPage, 
    totalResults,
    pageSize,
    onTableChange,
    callback1,
    callback2,isModalOpenEdit }) => {
    const executeCallback = async(data,id)=>{
        await callback1(data,id)
    }
    const showModal=()=>{
        callback2()
    }
    const getDataEdit=async(id)=>{
        const response = await attendanceService.get_update(id)
        // isModalOpenEdit(response.data)

    }

    const columns = [
         {
            title: "Acciones",
            key: "acciones",
            render: (_, row) => (
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                    <EditOutlined size="small" style={{ color: "green" }} onClick={()=>getDataEdit(row.id)} />
                    <DeleteOutlined size="small" style={{ color: "red" }} />
                    <SearchOutlined size="small" style={{ color: "blue" }} />
                </div>
            )
        },
        {
            title: "Trabajador",
            dataIndex: "fullname",
            key: "fullname",
        },
        {
            title: "Empresa",
            dataIndex: "company",
            key: "company",
        },
        {
            title: "H. Ingreso",
            dataIndex: "hora_ingreso",
            key: "hora_ingreso",
        },
        {
            title: "F. Ingreso",
            dataIndex: "fecha_ingreso",
            key: "fecha_ingreso",
        },
        {
            title: "H. Salida",
            dataIndex: "hora_salida",
            render: (_, row) => {
                if (!row.hora_salida) {
                    return (<Button size="small" style={{ backgroundColor: "gray", color: "white" }} onClick={()=>{
                        const hora_salida = dayjs().format('HH:mm:ss')
                        const fecha_salida =  dayjs().format('YYYY-MM-DD')
                        executeCallback({hora_salida,fecha_salida},row.id)
                    }}>
                        Marcar
                    </Button>)
                }
                return row.hora_salida
            }
        },
        {
            title: "F. Salida",
            dataIndex: "fecha_salida",
            key: "fecha_salida",
        },
        {
            title: "Placa",
            dataIndex: "placa",
            key: "placa",
        },
        {
            title: "#Parqueo",
            dataIndex: "n_parqueo",
            render: (_, row) => {
                if (!row.n_parque && row.placa) {
                    return (<Button size="small" onClick={showModal} style={{ backgroundColor: "gray", color: "white" }}>
                        Agregar
                    </Button>)
                }
                return row.n_parque
            }
        },
        {
            title: "Motivo",
            dataIndex: "motivo",
            key: "motivo",
        },
       
    ];
    return (

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
                onChange={onTableChange}
            />
            
      
    );
};

export default AttendanceTable;
