'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { App } from "antd";
import Button from "@/components/ui/Buttons";
import Input from "@/components/ui/Input";
import { VisitsTable } from "@/components/visits/VisitsTable";
import { visitsService } from "@/services/visitsService";
import { VisitsFormModal } from "@/components/visits/VisitsFormModal";
export default function Visits() {
    const { message } = App.useApp();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const searchInputRef = useRef(null);
    const [editingVisit, setEditingVisit] = useState(null);
    const pageSize = 15;

    const fetchVisitsData = useCallback(async (page, text = "") => {
        setLoading(true);
        try {
            const response = await visitsService.list(page, pageSize, text);
            setData(response.results);
            setTotalResults(response.count);
        } catch (error) {
            setData([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    useEffect(() => {
        const handler = setTimeout(() => {
            // When a new search is performed, we should ideally reset to page 1.
            // A simple way is to handle this in the input's onChange.
            // For now, this unified effect will handle fetching on both search and page change.
            fetchVisitsData(currentPage, searchText);
        }, 300); // Debounce requests to avoid spamming the API while typing

        return () => {
            clearTimeout(handler);
        };
    }, [currentPage, searchText, fetchVisitsData]);

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
        fetchVisitsData(currentPage);
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
            fetchVisitsData(currentPage);
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
            <div style={{ display: "flex", flexWrap: "wrap", flexDirection: 'row', justifyContent: "space-between" }}>
                <h3>Listado Ingresos y Salidas</h3>
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
                            setCurrentPage(1); // Reset to page 1 on new search
                        }}
                        onFocus={() => setIsSearchInputFocused(true)}
                        onBlur={() => setIsSearchInputFocused(false)}
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
