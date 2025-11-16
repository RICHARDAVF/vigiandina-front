'use client';

import { Form, Input, DatePicker, TimePicker, Button, Modal, Row, Col, App, Select, Checkbox, Table } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import { QrcodeOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { AuthContext } from "@/context/AuthContext";
import { collaboratorService } from "@/services/collaboratorService";
import BarcodeScanner from "@/utils/BarcodeScanner";
import { visitsService } from "@/services/visitsService";

export const VisitsFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchVisitsData, currentPage }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const { user } = useContext(AuthContext);
    const [masiveRegister, setMasiveRegister] = useState(false)
    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [searchTextCollaborator, setSearchTextCollaborator] = useState("")
    const [groupVisits, setGroupVisits] = useState([])
    const fetchCollaborators = useCallback(async (text) => {
        try {
            const response = await collaboratorService.search(text);
            setCollaborators(response.data);
        } catch (error) {
            setCollaborators([]);
        }
    }, []);

    useEffect(() => {
        if (isModalOpen) {
            form.setFieldsValue({
                fecha_ingreso: dayjs(),
                hora_ingreso: dayjs(),
                motivo: "LABORAR",
            });
        }
    }, [isModalOpen, form]);

    const sendBarcode = async (barcode_value) => {
        try {

            const response = await visitsService.search(barcode_value);
        
            if (!response.success) {
                messageApi.error(response.error || "Error al registrar la asistencia");
                return false;
            }
            if(masiveRegister){
                setGroupVisits((prev) => [response.data, ...prev])
                return true;
            }else{
                setIsScannerModalOpen(false)
                form.setFieldsValue({"documento":barcode_value})
                searchCredential()
                return true
            }
        } catch (error) {
            return false;
        }
    };
    const onReset = async () => {
        form.resetFields()
        setGroupVisits([])
        setMasiveRegister(false)
    }
    const saveMasiveRegister = async (payload) => {
        try {
            const response = await visitsService.createMasive(payload)
            if (!response.success) {
                messageApi.error(response.error)
                return
            }
            messageApi.success(response.message)
            onCancel();
            onReset()
            fetchVisitsData(currentPage);

        } catch (error) {
            messageApi.error(error.toString())
        }
    }
    const saveSingleRegister = async (payload) => {
        const response = await visitsService.create(payload);
        if (!response.success) {

            messageApi.error(response.error);
            return;
        }
        messageApi.success(response.message)
        onCancel();
        onReset()
        fetchVisitsData(currentPage);


    }
    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                usuario: user.id,
                fecha_ingreso: values.fecha_ingreso ? values.fecha_ingreso.format('YYYY-MM-DD') : null,
                hora_ingreso: values.hora_ingreso ? values.hora_ingreso.format('HH:mm:ss') : null,
                trabajador: values.trabajador?.value,
            };
            if (masiveRegister) {
                if (groupVisits.length === 0) {
                    messageApi.warning("No hay visitas en la lista")
                    return
                }
                payload["visits"] = groupVisits
                saveMasiveRegister(payload)

            } else {
                saveSingleRegister(payload)


            }


        } catch (error) {
            messageApi.error("Error al enviar los datos de asistencia");
        }
    };

    const onScanSuccess = useCallback(async (decodedText) => {

        try {
            const index = groupVisits.findIndex(item => item.dni == decodedText)
            if (index != -1) {
                messageApi.warning(`El documento ${decodedText} ya esta en la lista`)
                return
            }
            const success = await sendBarcode(decodedText);
            if (success) {
                messageApi.success(masiveRegister?"Se agrego a la lista":"Valores encontrados")
                return
            }
            messageApi.error("Ocurrio un error")
        } catch (error) {
            messageApi.error("Error al procesar el escaneo");
        }
    }, [sendBarcode]);
    const searchCollaborator = async (text) => {
        const lowercasedText = text.trim()
        if (lowercasedText.length > 3) {
            fetchCollaborators(text)
        }
    }
    const searchCredential = async () => {
        const { documento } = form.getFieldValue()
        const response = await visitsService.search(documento)
        if (!response.success) {
            messageApi.error(response.error)
            return
        }
        const dataCredential = response.data
        form.setFieldsValue({
            "firts_name": dataCredential.nombre,
            "last_name": dataCredential.apellidos,
            "document": dataCredential.documento_empresa,
            "company": dataCredential.empresa

        })
    }
    return (
        <Modal
            open={isModalOpen}
            title="Registrar Visita"
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="Registrar"
            cancelText="Cancelar"
            width="80%"
            centered
            style={{ maxWidth: 900 }}
        >
            <Form
                form={form}
                layout="vertical"
                size="middle"
                onFinish={onFinish}
                style={{ padding: '10px' }}
            >
                <Row>
                    <Checkbox
                        checked={masiveRegister}
                        onChange={() => setMasiveRegister(!masiveRegister)}
                    >
                        Registro Masivo
                    </Checkbox>


                    <Button icon={<QrcodeOutlined />} onClick={() => setIsScannerModalOpen(true)} />

                </Row>
                {!masiveRegister && (
                    <Row gutter={[12, 12]} align="bottom" wrap>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Form.Item
                                name="documento"
                                label="Documento"
                                rules={[{ required: true, message: 'Por favor ingresa un documento' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Ingrese número de documento" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>

                            <Form.Item
                                name="firts_name"
                                label="Nombre"
                                rules={[{ required: true, message: "Ingrese el nombre" }]}
                                style={{ marginBottom: 0 }}

                            >
                                <Input placeholder="Nombres del visitante" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>

                            <Form.Item
                                name="last_name"
                                label="Apellidos"
                                style={{ marginBottom: 0 }}

                            >
                                <Input placeholder="Apellidos del visitante" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>

                            <Button
                                onClick={searchCredential}
                                type="primary"
                                icon={<SearchOutlined />}
                                style={{ marginTop: 30 }}
                            >
                                Buscar
                            </Button>
                        </Col>
                    </Row>
                )}
                {masiveRegister && (
                    <Table
                        dataSource={groupVisits}
                        columns={[
                            {
                                title: "Documento",
                                dataIndex: "dni",
                                key: "dni"
                            },
                            {
                                title: "Nombre",
                                dataIndex: "nombre",
                                key: "nombre"
                            },
                            {
                                title: "Apellidos",
                                dataIndex: "apellidos",
                                key: "apellidos"
                            },
                        ]}
                        rowKey={(row) => `${row.dni}`}
                        size="small"
                        pagination={false}
                    />
                )}
                <Form.Item
                    name={"person_you_visit"}
                    label="Trabajador"
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: "Seleccione una persona" }]}
                >
                    <Select
                        showSearch
                        filterOption={false}
                        placeholder="Persona a quien visita"
                        fieldNames={{ "label": "fullname", "value": "id" }}
                        options={collaborators}
                        onSearch={(value) => {
                            searchCollaborator(value)
                        }}
                        notFoundContent={searchTextCollaborator ? "No se encontraron resultados" : "Escriba para buscar"}
                    />
                </Form.Item>
                <Form.Item
                    style={{ marginBottom: 0 }}

                    name="motivo" label="Motivo (Opcional)">
                    <Input placeholder="Ingrese motivo de la visita" />
                </Form.Item>

                <Row gutter={[12, 12]}>
                    <Col xs={24} md={8}>
                        <Form.Item name="position" label="Cargo"
                            style={{ marginBottom: 0 }}

                        >
                            <Input placeholder="Ej. Técnico, Supervisor..." />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            style={{ marginBottom: 0 }}

                            name="fecha_ingreso"
                            label="Fecha de Ingreso"
                            rules={[{ required: true, message: 'Seleccione la fecha de ingreso' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            style={{ marginBottom: 0 }}

                            name="hora_ingreso"
                            label="Hora de Ingreso"
                            rules={[{ required: true, message: 'Seleccione la hora de ingreso' }]}
                        >
                            <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Empresa */}
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={8}>
                        <Form.Item
                            style={{ marginBottom: 0 }}

                            name="document" label="RUC/DNI/CE/PP">
                            <Input placeholder="Número de documento" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            style={{ marginBottom: 0 }}

                            name="company" label="Razón Social">
                            <Input placeholder="Nombre de la empresa" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Button
                            block
                            icon={<SearchOutlined />}
                            style={{ marginTop: 30 }}
                            type="primary"
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>


                <Row >
                    <Form.Item
                        style={{ marginBottom: 0, flex: 1 }}

                        name="observation" label="Obervaciones">
                        <Input.TextArea rows={2} placeholder="Cantidad, Obs." />
                    </Form.Item>

                </Row>
            </Form>


            <Modal
                title="Escanear Código de Barras"
                open={isScannerModalOpen}
                onCancel={() => {
                    setIsScannerModalOpen(false)
                }}
                footer={null}
                width={500}
                centered
            >

                <div style={{ width: '100%', height: 350 }}>
                    <BarcodeScanner
                        qrCodeContainerId="qr-code-full-region"
                        onScanSuccess={onScanSuccess}
                        onScanError={(err) => console.warn("Scan error:", err)}
                        isModalOpen={isModalOpen}

                    />

                </div>

            </Modal>
        </Modal>
    );
};
