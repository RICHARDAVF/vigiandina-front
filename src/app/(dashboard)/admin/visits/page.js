'use client';

import { useState, useEffect,useRef, useCallback } from "react";
import { App } from "antd";
import Button from "@/components/ui/Buttons";
import Input from "@/components/ui/Input";
import { VisitsTable } from "@/components/visits/VisitsTable";
import { visitsService } from "@/services/visitsService";
import { VisitsFormModal } from "@/components/visits/VisitsFormModal";
export default function Visits(){
    const { message } = App.useApp()
    const [data,setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText,setSearchText] = useState("")
    const [isSearchInputFocused, setIsSearchInputFocused] = useState(false);
    const searchInputRef = useRef(null);
    
    const pageSize = 15;

    const fetchVisitsData = async (page,text="") => {
        setLoading(true);
        try {
            const response = await visitsService.list(page,pageSize,text);
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
    const searchData=useCallback( async(text)=>{
        const lowercasedText = text.toLowerCase()
        if(lowercasedText.trim()===""){
            fetchVisitsData(currentPage)
            return;
        }
        const result = data.filter((item)=>{
            const fullname = item.fullname?String(item.fullname).toLowerCase():''
            const documento = item.dni?String(item.dni):''
            return (
                fullname.includes(lowercasedText) || documento.includes(lowercasedText)
            )
        })
        if(result.length===0){
            fetchVisitsData(currentPage,text)
            return
        }
        setData(result)
    },[data,fetchVisitsData,currentPage])


    useEffect(() => {
        fetchVisitsData(currentPage);
    }, [currentPage]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };
    const updateRegister=async(data,id)=>{
        setLoading(true)
        const response = await visitsService.patch(data,id)
        if(!response.success){
            message.error(response.error)
            return 
        }
        message.success(response.message)
        fetchVisitsData(currentPage)
    }
    
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
             <div style={{display:"flex",flexWrap:"wrap",flexDirection:'row',justifyContent:"space-between"}}>
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
                            searchData(e.target.value);
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
            />
            <VisitsFormModal
            isModalOpen={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            loading={loading}
            fetchVisitsData={fetchVisitsData}
            currentPage={currentPage}
            />
        </div>
    )
}
