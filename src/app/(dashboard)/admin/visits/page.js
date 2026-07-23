'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { App, DatePicker, Select, Button, Input } from "antd";
import { VisitsTable } from "@/components/visits/VisitsTable";
import { visitsService } from "@/services/visitsService";
import { userConfigService } from "@/services/userConfigService";
import { VisitsFormModal } from "@/components/visits/VisitsFormModal";
import { PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function Visits() {
    const { message } = App.useApp();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [supervisedUsers, setSupervisedUsers] = useState([]);
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const searchInputRef = useRef(null);
    const [editingVisit, setEditingVisit] = useState(null);
    const pageSize = 15;

    const fetchVisitsData = useCallback(async (page, text = "", dates = dateRange, userFilter = selectedUser) => {
        setLoading(true);
        try {
            let startDate = "";
            let endDate = "";
            if (dates && dates.length === 2 && dates[0] && dates[1]) {
                startDate = dates[0].format('YYYY-MM-DD');
                endDate = dates[1].format('YYYY-MM-DD');
            }
            const response = await visitsService.list(page, pageSize, text, startDate, endDate, userFilter);
            const listData = Array.isArray(response?.results) ? response.results : (Array.isArray(response?.data) ? response.data : (Array.isArray(response) ? response : []));
            setData(listData);
            setTotalResults(response?.count ?? listData.length);
        } catch (error) {
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

    useEffect(() => {
        loadSupervisedUsers();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchVisitsData(currentPage, searchText, dateRange, selectedUser);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [currentPage, searchText, dateRange, selectedUser, fetchVisitsData]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };
    const updateRegister = async (data, id) => {
        setLoading(true);
        const response = await visitsService.patch(data, id);
        if (!response.success) {
            message.error(response.error);
            setLoading(false);
            return;
        }
        message.success(response.message);
        fetchVisitsData(currentPage, searchText, dateRange, selectedUser);
        setLoading(false);
    };

    const handleEdit = (record) => {
        setEditingVisit(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        const response = await visitsService.delete(id);
        if (!response.success) {
            message.error(response.error);
        } else {
            message.success(response.message);
            fetchVisitsData(currentPage, searchText, dateRange, selectedUser);
        }
        setLoading(false);
    };
    const showModal = () => {
        setEditingVisit(null);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingVisit(null);
    };
    return (
        <div>
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <h3>Listado de Visitas</h3>
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
            <VisitsTable
                data={data}
                loading={loading}
                currentPage={currentPage}
                totalResults={totalResults}
                pageSize={pageSize}
                onTableChange={handleTableChange}
                callback={updateRegister}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <VisitsFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                loading={loading}
                fetchVisitsData={fetchVisitsData}
                currentPage={currentPage}
                editingVisit={editingVisit}
            />
        </div>
    )
}
