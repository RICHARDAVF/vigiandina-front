'use client';

import { Form, Input, Modal, Select, App, Row, Col, DatePicker, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { attendanceService } from "@/services/attendanceService";
import { collaboratorService } from "@/services/collaboratorService";
import { parkingService } from "@/services/parkingService";
import dayjs from 'dayjs';

export const AttendanceFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchAttendanceData, editingAttendance }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const [collaborators, setCollaborators] = useState([]);
    const [parkings, setParkings] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            const fetchOptions = async () => {
                try {
                    // Always fetch parkings
                    const parkingsPromise = parkingService.list_available();

                    let collaboratorOptions = [];

                    // Conditionally fetch collaborators
                    if (editingAttendance) {
                        // EDIT MODE: Don't fetch the full list. Use the collaborator from the record.
                        if (editingAttendance.collaborator) {
                            const specificCollaborator = editingAttendance.collaborator;
                            const compatibleCollaborator = {
                                id: specificCollaborator.id,
                                nombre: specificCollaborator.fullname,
                                apellidos: '',
                                documento: ''
                            };
                            collaboratorOptions = [compatibleCollaborator];
                        }
                    } else {
                        // CREATE MODE: Fetch the full list for the dropdown.
                        const collaboratorsRes = await collaboratorService.get(1, 100, "");
                        collaboratorOptions = collaboratorsRes.results || collaboratorsRes;
                    }

                    const parkingsRes = await parkingsPromise;
                    const parkingOptions = parkingsRes.results || parkingsRes;

                    setCollaborators(collaboratorOptions);
                    setParkings(parkingOptions);

                } catch (error) {
                    console.error("Error fetching options:", error);
                    messageApi.error("Error al cargar opciones");
                }
            };
            fetchOptions();
        }
    }, [isModalOpen, editingAttendance, messageApi]);

    useEffect(() => {
        if (isModalOpen) {
            if (editingAttendance && collaborators.length > 0) {
                form.setFieldsValue({
                    ...editingAttendance,
                    // The form field is named 'trabajador', set it with the collaborator's ID
                    trabajador: editingAttendance.collaborator?.id,
                    n_parqueo: editingAttendance.n_parqueo?.id || editingAttendance.n_parqueo,
                    fecha_ingreso: editingAttendance.fecha_ingreso ? dayjs(editingAttendance.fecha_ingreso) : null,
                    hora_ingreso: editingAttendance.hora_ingreso ? dayjs(editingAttendance.hora_ingreso, 'HH:mm:ss') : null,
                    fecha_salida: editingAttendance.fecha_salida ? dayjs(editingAttendance.fecha_salida) : null,
                    hora_salida: editingAttendance.hora_salida ? dayjs(editingAttendance.hora_salida, 'HH:mm:ss') : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingAttendance, collaborators, parkings, form]);

    const onFinish = async (values) => {
        try {
            let response;
            const payload = {
                ...values,
                fecha_ingreso: values.fecha_ingreso ? values.fecha_ingreso.format('YYYY-MM-DD') : null,
                hora_ingreso: values.hora_ingreso ? values.hora_ingreso.format('HH:mm:ss') : null,
                fecha_salida: values.fecha_salida ? values.fecha_salida.format('YYYY-MM-DD') : null,
                hora_salida: values.hora_salida ? values.hora_salida.format('HH:mm:ss') : null,
            };

            if (editingAttendance) {
                response = await attendanceService.update(editingAttendance.id, payload);
            } else {
                // Create is handled differently in this module (often via barcode), but standard create can be supported
                response = await attendanceService.create(payload);
            }

            if (!response.success) {
                messageApi.error(response.error || "Error al guardar el registro");
                return;
            }

            messageApi.success(response.message);
            onCancel();
            form.resetFields();
            fetchAttendanceData();

        } catch (error) {
            messageApi.error("Error al enviar los datos");
        }
    };

    return (
        <Modal
            open={isModalOpen}
            title={editingAttendance ? "Editar Registro" : "Nuevo Registro"}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingAttendance ? "Actualizar" : "Crear"}
            cancelText="Cancelar"
            centered
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="trabajador"
                            label="Trabajador"
                            rules={[{ required: true, message: 'Seleccione trabajador' }]}
                        >
                            <Select
                                placeholder="Seleccione trabajador"
                                fieldNames={{ label: 'nombre', value: 'id' }} // Assuming name is enough, or construct label
                                options={collaborators.map(c => ({ ...c, nombre: `${c.nombre} ${c.apellidos} - ${c.documento}` }))}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.nombre ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="placa"
                            label="Placa Vehículo"
                        >
                            <Input placeholder="Placa" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item
                            name="fecha_ingreso"
                            label="Fecha Ingreso"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="hora_ingreso"
                            label="Hora Ingreso"
                        >
                            <TimePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="fecha_salida"
                            label="Fecha Salida"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            name="hora_salida"
                            label="Hora Salida"
                        >
                            <TimePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="n_parqueo"
                            label="Parqueo"
                        >
                            <Select
                                placeholder="Seleccione parqueo"
                                fieldNames={{ label: 'numero', value: 'id' }}
                                options={parkings}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="motivo"
                            label="Motivo"
                        >
                            <Input placeholder="Motivo" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};