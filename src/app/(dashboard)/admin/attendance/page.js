'use client';

import { Input, Button, Table, Space, App, Tag, DatePicker, Select } from "antd";
import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "@/services/api";
import { AttendanceFormModal } from "@/components/attendance/AttendanceFormModal";
import { attendanceService } from "@/services/attendanceService";
import AttendanceModalParking from "@/components/attendance/AttendanceModalParking";
import { parkingService } from "@/services/parkingService";
import { userConfigService } from "@/services/userConfigService";
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, FilterOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Attendace() {
    const { message, modal } = App.useApp()
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [supervisedUsers, setSupervisedUsers] = useState([]);
    const searchInputRef = useRef(null);
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false)
    const [parkin, setParking] = useState([])
    const [editingAttendance, setEditingAttendance] = useState(null);
    const pageSize = 15;

    const fetchAttendanceData = useCallback(async (page, query = "", dates = dateRange, userFilter = selectedUser) => {
        setLoading(true);
        try {
            let startDate = "";
            let endDate = "";
            if (dates && dates.length === 2 && dates[0] && dates[1]) {
                startDate = dates[0].format('YYYY-MM-DD');
                endDate = dates[1].format('YYYY-MM-DD');
            }
            const response = await attendanceService.list(page, pageSize, query, startDate, endDate, userFilter);
            if (response?.data?.success === false) {
                message.error(response.data.error || "Error desconocido");
                return;
            }

            setData(response.results);
            setTotalResults(response.count);

        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setData([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [pageSize, dateRange, selectedUser]);

    const loadSupervisedUsers = async () => {
        try {
            const res = await userConfigService.getSupervisedUsers();
            if (res?.data) {
                setSupervisedUsers(res.data);
            }
        } catch (err) {
            console.error("Error loading supervised users", err);
        }
    };

    const listAvaialbleParking = async () => {
        try {
            const response = await parkingService.list_available()
            if (response.data) {
                setParking(response.data)
            } else if (Array.isArray(response)) {
                setParking(response)
            } else {
                setParking([])
            }

        } catch (error) {
            console.error(error)
            message.error("Error al cargar parqueos")
        }
    }

    useEffect(() => {
        listAvaialbleParking();
        loadSupervisedUsers();
    }, [])

    const searchData = useCallback(async (text) => {
        fetchAttendanceData(currentPage, text, dateRange, selectedUser);
    }, [fetchAttendanceData, currentPage, dateRange, selectedUser]);

    useEffect(() => {
        fetchAttendanceData(currentPage, searchText, dateRange, selectedUser);
    }, [currentPage, dateRange, selectedUser, fetchAttendanceData]);

    useEffect(() => {
        let barcode = '';
        let timeout;

        const handleKeyDown = (e) => {
            if (!isSearchInputFocused) {
                return;
            }

            clearTimeout(timeout);

            if (e.key === 'Enter') {
                e.preventDefault();
                if (barcode) {
                    setSearchText(barcode);
                    searchData(barcode);
                    barcode = '';
                }
            } else {
                barcode += e.key;
            }

            timeout = setTimeout(() => {
                barcode = '';
            }, 100);
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timeout);
        };
    }, [isSearchInputFocused, searchData]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    const showModal = () => {
        setEditingAttendance(null);
        setIsModalOpen(true);
    };
    const showModal2 = () => {
        setIsModalOpen2(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingAttendance(null);
    };

    const updateRegister = async (data, id) => {
        setLoading(true)
        try {
            const response = await attendanceService.update(id, data)
            if (!response.success) {
                message.error(response.error)
                return
            }
            message.success(response.message)
            fetchAttendanceData(currentPage)
        } catch (error) {
            message.error("Error al actualizar registro")
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (record) => {
        setEditingAttendance(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record) => {
        modal.confirm({
            title: '¿Estás seguro de eliminar este registro?',
            content: `Se eliminará el registro de ${record.collaborator.fullname}`,
            okText: 'Sí, eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    const response = await attendanceService.delete(record.id);
                    if (response.success) {
                        message.success(response.message);
                        fetchAttendanceData(currentPage);
                    } else {
                        message.error(response.error || "Error al eliminar registro");
                    }
                } catch (error) {
                    message.error("Error al eliminar registro");
                }
            },
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: "Trabajador",
            dataIndex: ["collaborator", "fullname"],
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
                    return (<Button size="small" style={{ backgroundColor: "gray", color: "white" }} onClick={() => {
                        const hora_salida = dayjs().format('HH:mm:ss')
                        const fecha_salida = dayjs().format('YYYY-MM-DD')
                        updateRegister({ hora_salida, fecha_salida }, row.id)
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
                if (!row.n_parqueo && row.placa) { // Fixed typo n_parque -> n_parqueo based on serializer
                    return (<Button size="small" onClick={showModal2} style={{ backgroundColor: "gray", color: "white" }}>
                        Agregar
                    </Button>)
                }
                return row.n_parqueo // Fixed typo n_parque -> n_parqueo
            }
        },
        {
            title: "Motivo",
            dataIndex: "motivo",
            key: "motivo",
        },
        {
            title: "Acciones",
            key: "actions",
            render: (_, row) => (
                <Space size="small">
                    <Button
                        type="text"
                        size='small'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(row)}
                    />
                    <Button
                        type="text"
                        size='small'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(row)}
                    />
                </Space>
            )
        }
    ];

    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h3>Listado Ingresos y Salidas</h3>
                <div style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", alignItems: "center", justifyContent: "end", gap: 8 }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                        Agregar
                    </Button>
                    <RangePicker
                        placeholder={['Fecha Inicio', 'Fecha Fin']}
                        style={{ width: 240 }}
                        onChange={(dates) => {
                            setDateRange(dates || []);
                            setCurrentPage(1);
                        }}
                        value={dateRange}
                    />
                    <Select
                        placeholder="Filtrar por Usuario"
                        style={{ minWidth: 180 }}
                        allowClear
                        value={selectedUser}
                        onChange={(val) => {
                            setSelectedUser(val);
                            setCurrentPage(1);
                        }}
                    >
                        <Option value="-1">Todos los Usuarios</Option>
                        {supervisedUsers.map((u) => (
                            <Option key={u.id} value={u.id}>
                                {u.full_name || u.username}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        ref={searchInputRef}
                        placeholder="Buscar..."
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        onFocus={() => setIsSearchInputFocused(true)}
                        onBlur={() => setIsSearchInputFocused(false)}
                        style={{ width: 180 }}
                    />
                </div>
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

            <AttendanceFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                loading={loading}
                fetchAttendanceData={() => fetchAttendanceData(currentPage)}
                editingAttendance={editingAttendance}
            />
            <AttendanceModalParking
                isOpen={isModalOpen2}
                handleOk={() => { () => setIsModalOpen2(false) }}
                handleCancel={() => setIsModalOpen2(false)}
                data={parkin}
            />
        </div>
    );
}
