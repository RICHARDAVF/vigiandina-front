'use client';

import { Form, Input, DatePicker, TimePicker, Select, Button, Modal, App } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { AuthContext } from "@/context/AuthContext";
import { collaboratorService } from "@/services/collaboratorService";
import { api } from "@/services/api";
import BarcodeScanner from "@/utils/BarcodeScanner";
import { API_ENDPOINTS } from "@/utils/constants";
import { attendanceService } from "@/services/attendanceService";


const AttendanceFormModal = ({ 
    isModalOpen, 
    onCancel, 
    loading, 
    fetchAttendanceData, 
    currentPage,data }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const { user } = useContext(AuthContext);
    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [collaborators, setCollaborators] = useState([]);

    const fetchCollaborators = useCallback(async (query="") => {
        try {
            const response = await collaboratorService.search(query);
            setCollaborators(response.data);
        } catch (error) {
            console.error("Error fetching collaborators:", error);
            setCollaborators([]);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen ) {
            form.resetFields();
            const newdata = {}
            if(data?.trabajador){
                newdata["fecha_ingreso"] = dayjs(data["fecha_ingreso"])
                newdata["hora_ingreso"] = dayjs(data["hora_ingreso"],"HH:mm:ss")
                newdata["trabajador"] = {"label":data["fullname"],"value":data["trabajador"]}
                newdata["motivo"] = data["motivo"]
                newdata["placa"] = data["placa"]

            }
            form.setFieldsValue({
                fecha_ingreso: dayjs(),
                hora_ingreso: dayjs(),
                motivo: "LABORAR",
                ...newdata

            });

        }
    }, [isModalOpen, form]);
    const sendBarcode = async (barcode_value) => {
        try {
            const fecha_ingreso = dayjs().format('YYYY-MM-DD')
            const hora_ingreso = dayjs().format('HH:mm:ss')
            const response = await api.post(API_ENDPOINTS.ATTENDANCE.CREATE, 
            {
                barcode_value,
                usuario: user.id,
                fecha_ingreso,
                hora_ingreso
            });
            
            if (!response.success) {
                messageApi.error(response.error || "Error al registrar la asistencia");
                return false;
            }

            messageApi.success(response.message || "Asistencia registrada exitosamente");
            return true;
        } catch (error) {
            console.error("Error en sendBarcode:", error);
            messageApi.error("Error de conexión al registrar asistencia");
            return false;
        }
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                usuario: user.id,
                fecha_ingreso: values.fecha_ingreso ? values.fecha_ingreso.format('YYYY-MM-DD') : null,
                hora_ingreso: values.hora_ingreso ? values.hora_ingreso.format('HH:mm:ss') : null,
                trabajador: values.trabajador
            };
            const response = await attendanceService.create(payload); 
            if (!response.success) {
     
                messageApi.error(response.error);
                return;
            }
            
            messageApi.success(response.message);
            onCancel();
            fetchAttendanceData(currentPage);
        } catch (error) {
            
            messageApi.error("Error al enviar los datos de asistencia");
        }
    };

    const onScanSuccess = useCallback(async (decodedText) => {

        try {
            const success = await sendBarcode(decodedText);
            
            if (success) {
                fetchAttendanceData(currentPage);
                
            }
        } catch (error) {
            console.error("Error en onScanSuccess:", error);
            messageApi.error("Error al procesar el escaneo");
        } 
    }, [sendBarcode]);
    const searchCollaborator = async (text) => {
        const lowercasedText = text.trim()
        if (lowercasedText.length > 3) {
            fetchCollaborators(text)
        }
    }
    return (
        <Modal
            open={isModalOpen}
            title="Registrar Asistencia"
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Registrar"
            cancelText="Cancelar"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: '10px' }}>
                    <Form.Item
                        name="trabajador"
                        label="Trabajador"
                        rules={[{ required: true, message: 'Por favor selecciona un trabajador!' }]}
                        style={{ flex: 1, marginBottom: 0 }}
                    >
                        <Select
                            showSearch
                            placeholder="Selecciona un trabajador"
                            filterOption={false}
                            fieldNames={{"label":"fullname","value":"id"}}
                            options={collaborators}
                            onSearch={(value)=>{
                                searchCollaborator(value)
                            }}
                            notFoundContent="No se encontraron resultados"
                        >
                        </Select>
                    </Form.Item>
                    <Button 
                        onClick={() => {
                            setIsScannerModalOpen(true);
                        }} 
                        style={{ marginTop: 30 }} 
                        icon={<QrcodeOutlined />}
                        type="primary"
                    />
                </div>

                <Form.Item
                    name="fecha_ingreso"
                    label="Fecha de Ingreso"
                    rules={[{ required: true, message: 'Por favor selecciona la fecha de ingreso!' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    name="hora_ingreso"
                    label="Hora de Ingreso"
                    rules={[{ required: true, message: 'Por favor selecciona la hora de ingreso!' }]}
                >
                    <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                </Form.Item>

                <Form.Item
                    name="motivo"
                    label="Motivo (Opcional)"
                >
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item
                    name="vehiculo"
                    label="Vehículo (Opcional)"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="placa"
                    label="Placa (Opcional)"
                >
                    <Input />
                </Form.Item>
            </Form>

            <Modal
                title="Escanear Código de Barras"
                open={isScannerModalOpen}
                onCancel={() => {
                    setIsScannerModalOpen(false);
                }}
                footer={null}
                width={500}
                centered
            >
                <div style={{ width: '100%', height: 350 }}>
              
                <BarcodeScanner
                    qrCodeContainerId="qr-code-full-region"
                    onScanSuccess={onScanSuccess}
                    onScanError={(errorMessage) => {
                        console.warn(`Code scan error = ${errorMessage}`);
                    }}
                    isModalOpen={isModalOpen}
                />
                </div>
          
            </Modal>
        </Modal>
    );
};

export default AttendanceFormModal;