'use client';

import { Form, Input, Modal, App, Row, Col } from "antd";
import { useEffect } from "react";
import { companyService } from "@/services/companyService";

export const CompanyFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchCompaniesData, editingCompany }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();

    useEffect(() => {
        if (isModalOpen) {
            if (editingCompany) {
                form.setFieldsValue(editingCompany);
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingCompany, form]);

    const onFinish = async (values) => {
        try {
            let response;
            if (editingCompany) {
                response = await companyService.update(editingCompany.id, values);
            } else {
                // Create not implemented yet
                messageApi.warning("Create company not implemented yet");
                return;
            }

            if (!response.success) {
                messageApi.error(response.error || "Error al guardar la empresa");
                return;
            }

            messageApi.success(response.message);
            onCancel();
            form.resetFields();
            fetchCompaniesData();

        } catch (error) {
            messageApi.error("Error al enviar los datos");
        }
    };

    return (
        <Modal
            open={isModalOpen}
            title={editingCompany ? "Editar Empresa" : "Nueva Empresa"}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingCompany ? "Actualizar" : "Crear"}
            cancelText="Cancelar"
            centered
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="ruc"
                            label="RUC"
                            rules={[{ required: true, message: 'Ingrese RUC' }]}
                        >
                            <Input placeholder="RUC" maxLength={11} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="abreviacion"
                            label="Abreviación"
                        >
                            <Input placeholder="Abreviación" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="razon_social"
                            label="Razón Social"
                            rules={[{ required: true, message: 'Ingrese Razón Social' }]}
                        >
                            <Input placeholder="Razón Social" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="direccion"
                            label="Dirección"
                        >
                            <Input placeholder="Dirección" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};
