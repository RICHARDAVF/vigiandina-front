'use client';

import { Input, Button } from "antd";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/services/api";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceFormModal from "@/components/attendance/AttendanceFormModal";
import { attendanceService } from "@/services/attendanceService";
import { App } from "antd";
export default function Attendace() {
    const { message } = App.useApp()
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const searchInputRef = useRef(null);
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pageSize = 15;

    const fetchAttendanceData = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await api.get(`/v1/attendance/list/?page=${page}&page_size=${pageSize}`);
            setData(response.results);
            setTotalResults(response.count);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
            setData([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    const searchData = useCallback(async (text) => {
        const lowercasedText = text.toLowerCase();
        if (lowercasedText.trim() === "") {
            fetchAttendanceData(currentPage);
            return;
        }
        const result = data.filter((item) => {
            const fullname = item.fullname ? String(item.fullname).toLowerCase() : '';
            const company = item.company ? String(item.company).toLowerCase() : '';

            return (
                fullname.includes(lowercasedText) ||
                company.includes(lowercasedText)
            );
        });
        setData(result);
    }, [data, fetchAttendanceData, currentPage]);

    useEffect(() => {
        fetchAttendanceData(currentPage);
    }, [currentPage, fetchAttendanceData]);

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
        setIsModalOpen(true);
    };

    const handleOk = () => {

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const updateRegister=async(data,id)=>{
        setLoading(true)
        const response = await attendanceService.patch(data,id)
        if(!response.success){
            message.error(response.error)
            return
        }
        message.success(response.message)
        fetchAttendanceData(currentPage)

    }
    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", gap: 8 }}>
                <Button onClick={showModal}>
                    Agregar
                </Button>
                <Input
                    ref={searchInputRef}
                    placeholder="Buscar"
                    value={searchText}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        searchData(e.target.value);
                    }}
                    onFocus={() => setIsSearchInputFocused(true)}
                    onBlur={() => setIsSearchInputFocused(false)}
                    style={{ maxWidth: 300 }}
                />
            </div>
            <AttendanceTable
                data={data}
                loading={loading}
                currentPage={currentPage}
                totalResults={totalResults}
                pageSize={pageSize}
                onTableChange={handleTableChange}
                callback={updateRegister}

            />
            <AttendanceFormModal
                isModalOpen={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                loading={loading}
                fetchAttendanceData={fetchAttendanceData}
                currentPage={currentPage}
            />
        </div>
    );
}
