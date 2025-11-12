'use client';

import { Form, Input, DatePicker, TimePicker, Select, Button, Modal, App } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import { QrcodeOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { AuthContext } from "@/context/AuthContext";
import { collaboratorService } from "@/services/collaboratorService";
import { api } from "@/services/api";
import BarcodeScanner from "./BarcodeScanner";
import { API_ENDPOINTS } from "@/utils/constants";

const { Option } = Select;

const AttendanceFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchAttendanceData, currentPage }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const { user } = useContext(AuthContext);

    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [selectSearchValue, setSelectSearchValue] = useState('');

    const fetchCollaborators = useCallback(async () => {
        try {
            const response = await api.get(`/v1/collaborators/list/?page_size=1000`);
            setCollaborators(response.results);
        } catch (error) {
            console.error("Error fetching collaborators:", error);
            setCollaborators([]);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            form.setFieldsValue({
                fecha_ingreso: dayjs(),
                hora_ingreso: dayjs(),
                motivo: "LABORAR",
            });
            fetchCollaborators();
        }
    }, [isModalOpen, form, fetchCollaborators]);

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
                trabajador: values.trabajador.value,
            };
            const response = await collaboratorService.create(payload);
            
            if (!response.success) {
                let errorMessage = "Ocurrió un error desconocido.";
                if (response.error) {
                    if (typeof response.error === 'string') {
                        errorMessage = response.error;
                    } else if (response.error.non_field_errors && response.error.non_field_errors.length > 0) {
                        errorMessage = response.error.non_field_errors[0];
                    } else if (response.error.trabajador && response.error.trabajador.length > 0) {
                        errorMessage = response.error.trabajador[0];
                    }
                }
                messageApi.error(errorMessage);
                return;
            }
            
            messageApi.success(response.message);
            onCancel();
            fetchAttendanceData(currentPage);
        } catch (error) {
            console.error("Error submitting attendance data:", error);
            messageApi.error("Error al enviar los datos de asistencia");
        }
    };

    const onScanSuccess = useCallback(async (decodedText, decodedResult) => {
        if (isScanning) {
            return;
        }
        setIsScanning(true);

        try {
            // Primero enviar el código de barras
            const success = await sendBarcode(decodedText);
            
            if (success) {
                // Solo actualizar UI si el envío fue exitoso
                setIsScannerModalOpen(false);
                
                // Buscar el colaborador por documento y setear en el form
                const colaborador = collaborators.find(c => c.documento === decodedText);
                if (colaborador) {
                    form.setFieldsValue({ 
                        trabajador: { 
                            value: colaborador.id, 
                            label: `${colaborador.nombre} ${colaborador.apellidos} ${colaborador.documento}` 
                        } 
                    });
                    setSelectSearchValue(colaborador.id);
                } else {
                    messageApi.warning("No se encontró un colaborador con ese documento");
                }
                
                // Refrescar la tabla
                fetchAttendanceData(currentPage);
            }
        } catch (error) {
            console.error("Error en onScanSuccess:", error);
            messageApi.error("Error al procesar el escaneo");
        } finally {
            // Siempre restablecer isScanning después de un delay
            setTimeout(() => {
                setIsScanning(false);
            }, 1000);
        }
    }, [isScanning, messageApi, form, collaborators, currentPage, fetchAttendanceData, sendBarcode]);

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
                            optionFilterProp="children"
                            filterOption={(input, option) => {
                                const colaborador = collaborators.find(c => c.id === option.value);
                                if (!colaborador) return false;
                                const text = `${colaborador.nombre} ${colaborador.apellidos} ${colaborador.documento}`.toLowerCase();
                                return text.includes(input.toLowerCase());
                            }}
                            labelInValue
                        >
                            {collaborators.map(colaborador => (
                                <Option key={colaborador.id} value={colaborador.id}>
                                    {colaborador.nombre} {colaborador.apellidos} - {colaborador.documento}
                                </Option>
                            ))}
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
                    setIsScanning(false);
                }}
                footer={null}
                width={600}
            >
                {isScannerModalOpen && (
                    <BarcodeScanner
                        qrCodeContainerId="qr-code-full-region"
                        onScanSuccess={onScanSuccess}
                        onScanError={(errorMessage) => {
                            console.warn(`Code scan error = ${errorMessage}`);
                        }}
                        isModalOpen={isScannerModalOpen}
                        isScanning={isScanning}
                    />
                )}
            </Modal>
        </Modal>
    );
};

export default AttendanceFormModal;