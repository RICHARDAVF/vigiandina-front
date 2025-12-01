'use client';

import { Form, Input, Modal, Select, App, Row, Col } from "antd";
import { useEffect } from "react";
import { userService } from "@/services/userService";

export const UserFormModal = ({ isModalOpen, onCancel, onOk, loading, fetchUsersData, editingUser }) => {
    const [form] = Form.useForm();
    const { message: messageApi } = App.useApp();

    useEffect(() => {
        if (isModalOpen) {
            if (editingUser) {
                form.setFieldsValue(editingUser);
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingUser, form]);

    const onFinish = async (values) => {
        try {
            let response;
            if (editingUser) {
                response = await userService.update(editingUser.id, values);
            } else {
                // TODO: Implement create user if needed later, for now just update
                messageApi.warning("Create user not implemented yet");
                return;
            }

            if (!response.success) {
                messageApi.error(response.error || "Error al guardar el usuario");
                return;
            }

            messageApi.success(response.message);
            onCancel();
            form.resetFields();
            fetchUsersData();

        } catch (error) {
            messageApi.error("Error al enviar los datos");
        }
    };

    return (
        <Modal
            open={isModalOpen}
            title={editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingUser ? "Actualizar" : "Crear"}
            cancelText="Cancelar"
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="username"
                            label="Usuario"
                            rules={[{ required: true, message: 'Por favor ingrese el usuario' }]}
                        >
                            <Input placeholder="Nombre de usuario" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Por favor ingrese el email' },
                                { type: 'email', message: 'Ingrese un email válido' }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="first_name"
                            label="Nombres"
                        >
                            <Input placeholder="Nombres" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="last_name"
                            label="Apellidos"
                        >
                            <Input placeholder="Apellidos" />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="is_active"
                    label="Estado"
                    initialValue={true}
                >
                    <Select>
                        <Select.Option value={true}>Activo</Select.Option>
                        <Select.Option value={false}>Inactivo</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
