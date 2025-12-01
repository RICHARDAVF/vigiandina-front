'use client';

import { Form, Input, DatePicker, TimePicker, Button, Modal, Row, Col, App, Select, Checkbox, Table } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";
import { QrcodeOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { AuthContext } from "@/context/AuthContext";
import { collaboratorService } from "@/services/collaboratorService";
import BarcodeScanner from "@/utils/BarcodeScanner";
import { visitsService } from "@/services/visitsService";

export const VisitsFormModal = ({
    isModalOpen,
    onCancel,
    loading,
    fetchVisitsData,
    currentPage,
    editingVisit,
}) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const { user } = useContext(AuthContext);

    const [masiveRegister, setMasiveRegister] = useState(false);
    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [searchTextCollaborator, setSearchTextCollaborator] = useState('');
    const [groupVisits, setGroupVisits] = useState([]);

    // Load collaborator options when searching
    const fetchCollaborators = useCallback(async (text) => {
        try {
            const response = await collaboratorService.search(text);
            if (response.success) {
                setCollaborators(response.data);
            } else {
                setCollaborators([]);
            }
        } catch {
            setCollaborators([]);
        }
    }, []);

    // Initialise form when modal opens
    useEffect(() => {
        if (isModalOpen) {
            if (editingVisit) {
                // EDIT MODE: Use the pre-fetched collaborator data
                if (editingVisit.person_you_visit) {
                    // The Select component needs an array of options.
                    // We provide an array with just the collaborator from the visit record.
                    setCollaborators([editingVisit.person_you_visit]);
                }

                // Explicitly map the fields from the editingVisit object to the form fields
                form.setFieldsValue({
                    documento: editingVisit.dni,
                    firts_name: editingVisit.nombre,
                    last_name: editingVisit.apellidos,
                    document: editingVisit.documento_empresa,
                    company: editingVisit.empresa,
                    position: editingVisit.cargo,
                    motivo: editingVisit.motivo,
                    observation: editingVisit.observacion,
                    
                    // Handle date/time fields
                    fecha_ingreso: editingVisit.fecha ? dayjs(editingVisit.fecha) : null,
                    hora_ingreso: editingVisit.h_llegada ? dayjs(editingVisit.h_llegada, 'HH:mm:ss') : null,
                    
                    // Handle the person_you_visit Select
                    person_you_visit: editingVisit.person_you_visit?.id,
                });
                setMasiveRegister(false);
            } else {
                // CREATE MODE
                form.resetFields();
                form.setFieldsValue({
                    fecha_ingreso: dayjs(),
                    hora_ingreso: dayjs(),
                    motivo: 'LABORAR',
                });
                setCollaborators([]); // Clear previous options
                setMasiveRegister(false);
                setGroupVisits([]);
            }
        } else {
            // Cleanup when modal closes
            form.resetFields();
            setCollaborators([]);
            setMasiveRegister(false);
            setGroupVisits([]);
        }
    }, [isModalOpen, editingVisit, form]);

    // Barcode handling
    const sendBarcode = async (barcodeValue) => {
        try {
            const response = await visitsService.search(barcodeValue);
            if (!response.success) {
                messageApi.error(response.error || 'Error al buscar credencial');
                return false;
            }
            const data = response.data;
            if (masiveRegister) {
                setGroupVisits((prev) => [data, ...prev]);
            } else {
                form.setFieldsValue({
                    documento: data.dni,
                    firts_name: data.nombre,
                    last_name: data.apellidos,
                    document: data.documento_empresa,
                    company: data.empresa,
                });
            }
            return true;
        } catch {
            messageApi.error('Error al procesar el código de barras');
            return false;
        }
    };

    const onScanSuccess = useCallback(
        async (decodedText) => {
            try {
                if (masiveRegister) {
                    const exists = groupVisits.some((v) => v.dni === decodedText);
                    if (exists) {
                        messageApi.warning(`El documento ${decodedText} ya está en la lista`);
                        return;
                    }
                }
                const ok = await sendBarcode(decodedText);
                if (ok) {
                    messageApi.success(
                        masiveRegister ? 'Se agregó a la lista' : 'Valores encontrados',
                    );
                } else {
                    messageApi.error('Error al escanear código');
                }
            } catch {
                messageApi.error('Error al procesar el escaneo');
            }
        },
        [masiveRegister, groupVisits, sendBarcode, messageApi],
    );

    const onFinish = async (values) => {
        const payload = {
            ...values,
            usuario: user.id,
            fecha_ingreso: values.fecha_ingreso ? values.fecha_ingreso.format('YYYY-MM-DD') : null,
            hora_ingreso: values.hora_ingreso ? values.hora_ingreso.format('HH:mm:ss') : null,
            trabajador: values.person_you_visit?.value,
        };
        try {
            let response;
            if (editingVisit) {
                response = await visitsService.patch(payload, editingVisit.id);
            } else if (masiveRegister) {
                if (groupVisits.length === 0) {
                    messageApi.warning('No hay visitas en la lista');
                    return;
                }
                payload.visits = groupVisits;
                response = await visitsService.createMasive(payload);
            } else {
                response = await visitsService.create(payload);
            }
            if (!response.success) {
                messageApi.error(response.error);
                return;
            }
            messageApi.success(response.message);
            onCancel();
            fetchVisitsData(currentPage);
        } catch {
            messageApi.error('Error al enviar los datos');
        }
    };

    const searchCollaborator = async (text) => {
        const trimmed = text.trim();
        setSearchTextCollaborator(trimmed);
        if (trimmed.length > 3) {
            fetchCollaborators(trimmed);
        } else {
            setCollaborators([]);
        }
    };

    const searchCredential = async () => {
        const { documento } = form.getFieldValue();
        if (!documento) {
            messageApi.warning('Ingrese un documento para buscar');
            return;
        }
        const response = await visitsService.search(documento);
        if (!response.success) {
            messageApi.error(response.error);
            return;
        }
        const data = response.data;
        form.setFieldsValue({
            firts_name: data.nombre,
            last_name: data.apellidos,
            document: data.documento_empresa,
            company: data.empresa,
        });
        messageApi.success('Credenciales encontradas');
    };

    return (
        <Modal
            open={isModalOpen}
            title={editingVisit ? 'Editar Visita' : 'Registrar Visita'}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingVisit ? 'Actualizar' : 'Registrar'}
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
                {/* Header actions */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Checkbox
                            checked={masiveRegister}
                            onChange={(e) => {
                                setMasiveRegister(e.target.checked);
                                setGroupVisits([]);
                                form.resetFields([
                                    'documento',
                                    'firts_name',
                                    'last_name',
                                    'document',
                                    'company',
                                ]);
                            }}
                            disabled={!!editingVisit}
                        >
                            Registro Masivo
                        </Checkbox>
                    </Col>
                    <Col>
                        <Button icon={<QrcodeOutlined />} onClick={() => setIsScannerModalOpen(true)}>
                            Escanear
                        </Button>
                    </Col>
                </Row>

                {/* Single‑record fields */}
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
                                rules={[{ required: true, message: 'Ingrese el nombre' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Input placeholder="Nombres del visitante" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Form.Item name="last_name" label="Apellidos" style={{ marginBottom: 0 }}>
                                <Input placeholder="Apellidos del visitante" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={6}>
                            <Button
                                onClick={searchCredential}
                                type="primary"
                                icon={<SearchOutlined />}
                                style={{ marginTop: 30 }}
                                block
                            >
                                Buscar
                            </Button>
                        </Col>
                    </Row>
                )}

                {/* Masive list */}
                {masiveRegister && (
                    <Table
                        dataSource={groupVisits}
                        columns={[
                            { title: 'Documento', dataIndex: 'dni', key: 'dni' },
                            { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
                            { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
                        ]}
                        rowKey={(row) => `${row.dni}`}
                        size="small"
                        pagination={false}
                        style={{ marginBottom: 16 }}
                    />
                )}

                {/* Collaborator selector */}
                <Form.Item
                    name="person_you_visit"
                    label="Trabajador"
                    style={{ marginBottom: 0 }}
                    rules={[{ required: true, message: 'Seleccione una persona' }]}
                >
                    <Select
                        showSearch
                        filterOption={false}
                        placeholder="Persona a quien visita"
                        fieldNames={{ label: 'fullname', value: 'id' }}
                        options={collaborators}
                        onSearch={searchCollaborator}
                        notFoundContent={
                            searchTextCollaborator ? 'No se encontraron resultados' : 'Escriba para buscar'
                        }
                    />
                </Form.Item>

                {/* Optional motive */}
                <Form.Item name="motivo" label="Motivo (Opcional)" style={{ marginBottom: 0 }}>
                    <Input placeholder="Ingrese motivo de la visita" />
                </Form.Item>

                {/* Position & dates */}
                <Row gutter={[12, 12]}>
                    <Col xs={24} md={8}>
                        <Form.Item name="position" label="Cargo" style={{ marginBottom: 0 }}>
                            <Input placeholder="Ej. Técnico, Supervisor..." />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
                            name="fecha_ingreso"
                            label="Fecha de Ingreso"
                            rules={[{ required: true, message: 'Seleccione la fecha de ingreso' }]}
                        >
                            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                        <Form.Item
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
                        <Form.Item name="document" label="RUC/DNI/CE/PP" style={{ marginBottom: 0 }}>
                            <Input placeholder="Número de documento" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="company" label="Razón Social" style={{ marginBottom: 0 }}>
                            <Input placeholder="Nombre de la empresa" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                        <Button
                            block
                            icon={<SearchOutlined />}
                            style={{ marginTop: 30 }}
                            type="primary"
                            onClick={() => messageApi.info('Búsqueda de empresa no implementada')}
                        >
                            Buscar
                        </Button>
                    </Col>
                </Row>

                {/* Observaciones */}
                <Row>
                    <Form.Item
                        name="observation"
                        label="Observaciones"
                        style={{ marginBottom: 0, flex: 1 }}
                    >
                        <Input.TextArea rows={2} placeholder="Cantidad, Obs." />
                    </Form.Item>
                </Row>
            </Form>

            {/* Barcode scanner modal */}
            <Modal
                title="Escanear Código de Barras"
                open={isScannerModalOpen}
                onCancel={() => setIsScannerModalOpen(false)}
                footer={null}
                width={500}
                centered
            >
                <div style={{ width: '100%', height: 350 }}>
                    <BarcodeScanner
                        qrCodeContainerId="qr-code-full-region"
                        onScanSuccess={onScanSuccess}
                        onScanError={(err) => console.warn('Scan error:', err)}
                        isModalOpen={isScannerModalOpen}
                    />
                </div>
            </Modal>
        </Modal>
    );
};
