'use client';

import { Form, Input, Modal, Select, App, Row, Col, Switch } from "antd";
import { useEffect, useState } from "react";
import { collaboratorService } from "@/services/collaboratorService";
import { companyService } from "@/services/companyService";
import { areaService } from "@/services/areaService";
import { positionService } from "@/services/positionService";

export const CollaboratorFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchCollaboratorsData, editingCollaborator, currentPage }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();
    const [companies, setCompanies] = useState([]);
    const [areas, setAreas] = useState([]);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchAndSetData = async () => {
            if (isModalOpen) {
                try {
                    // 1. Fetch all options
                    const [companiesRes, areasRes, positionsRes] = await Promise.all([
                        companyService.get(),
                        areaService.list(1, 100, ""),
                        positionService.get()
                    ]);

                    let companyOptions = companiesRes.results || companiesRes;
                    let areaOptions = areasRes.results || areasRes;
                    let positionOptions = positionsRes.results || positionsRes;

                    // 2. If editing, ensure the specific options from the record are in the lists
                    if (editingCollaborator) {
                        const { company, area, position } = editingCollaborator;

                        // For company, the Select expects 'razon_social' but the serializer gives 'abreviacion'.
                        // We create a compatible object for display purposes.
                        if (company && !companyOptions.some(c => c.id === company.id)) {
                            companyOptions.unshift({ id: company.id, razon_social: company.abreviacion });
                        }
                        if (area && !areaOptions.some(a => a.id === area.id)) {
                            areaOptions.unshift(area);
                        }
                        if (position && !positionOptions.some(p => p.id === position.id)) {
                            positionOptions.unshift(position);
                        }

                        // 3. Now set the form values using the IDs
                        form.setFieldsValue({
                            documento: editingCollaborator.documento,
                            nombre: editingCollaborator.nombre,
                            apellidos: editingCollaborator.apellidos,
                            estado: editingCollaborator.estado,
                            company: company?.id,
                            area: area?.id,
                            position: position?.id,
                        });
                    } else {
                        form.resetFields();
                        form.setFieldsValue({ estado: true });
                    }

                    setCompanies(companyOptions);
                    setAreas(areaOptions);
                    setPositions(positionOptions);

                } catch (error) {
                    console.error("Error fetching options:", error);
                    messageApi.error("Error al cargar opciones");
                }
            }
        };

        if (isModalOpen) {
            fetchAndSetData();
        }
    }, [isModalOpen, editingCollaborator, form, messageApi]);

    const onFinish = async (values) => {
        try {
            let response;
            // The `values` object from the form now matches the expected payload.
            const payload = values;

            if (editingCollaborator) {
                response = await collaboratorService.update(editingCollaborator.id, payload);
            } else {
                // Create not implemented yet in this task scope, but good to have structure
                messageApi.warning("Create collaborator not implemented yet");
                return;
            }

            if (!response.success) {
                messageApi.error(response.error || "Error al guardar el colaborador");
                return;
            }

            messageApi.success(response.message);
            onCancel();
            form.resetFields();
            fetchCollaboratorsData(currentPage);

        } catch (error) {
            messageApi.error("Error al enviar los datos");
        }
    };

    return (
        <Modal
            open={isModalOpen}
            title={editingCollaborator ? "Editar Colaborador" : "Nuevo Colaborador"}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingCollaborator ? "Actualizar" : "Crear"}
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
                    <Col span={8}>
                        <Form.Item
                            name="documento"
                            label="Documento"
                            rules={[{ required: true, message: 'Ingrese documento' }]}
                        >
                            <Input placeholder="DNI/CE" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="nombre"
                            label="Nombres"
                            rules={[{ required: true, message: 'Ingrese nombres' }]}
                        >
                            <Input placeholder="Nombres" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="apellidos"
                            label="Apellidos"
                            rules={[{ required: true, message: 'Ingrese apellidos' }]}
                        >
                            <Input placeholder="Apellidos" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="company"
                            label="Empresa"
                            rules={[{ required: true, message: 'Seleccione empresa' }]}
                        >
                            <Select
                                placeholder="Seleccione empresa"
                                fieldNames={{ label: 'razon_social', value: 'id' }}
                                options={companies}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="area"
                            label="Área"
                            rules={[{ required: true, message: 'Seleccione área' }]}
                        >
                            <Select
                                placeholder="Seleccione área"
                                fieldNames={{ label: 'area', value: 'id' }}
                                options={areas}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="position"
                            label="Cargo"
                            rules={[{ required: true, message: 'Seleccione cargo' }]}
                        >
                            <Select
                                placeholder="Seleccione cargo"
                                fieldNames={{ label: 'cargo', value: 'id' }}
                                options={positions}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="estado"
                            label="Estado"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
