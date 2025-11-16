import { Table } from "antd";
import Button from "../ui/Buttons";
import dayjs from 'dayjs';

export  const VisitsTable=({data,loading,currentPage,totalResults,pageSize,onTableChange,callback})=>{
    const executeCallback =async(data,id)=>{
        await callback(data,id)
    }
   const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Estado',
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
            key: 'fullname',
            dataIndex:"fullname"
           
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
                if(row.h_inicio){
                    fulldate=fulldate+` ${row.h_inicio}`
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
                if(!row.h_salida){
                    return (
                        <Button
                        onClick={()=>{
                            const hora_salida = dayjs().format('HH:mm:ss')
                            const fecha_salida =  dayjs().format('YYYY-MM-DD')
                            executeCallback({hora_salida,fecha_salida},row.id)
                        }} 
                        size="small" style={{backgroundColor:'gray',color:'white'}}>
                            Marcar
                        </Button>
                    )
                }
                
                fulldate=row.fecha_salida?row.fecha_salida+` ${row.h_salida}`:'0000-00-00'+` ${row.h_salida}`
                
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
    return (
        <Table
        columns={columns}
        dataSource={data}
        rowKey={(row)=>`${row.id}`}
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
    )
}