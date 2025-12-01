'use client';
import { Form, Input, Modal, App } from "antd";
import { useEffect, useState } from "react";
import { areaService } from "@/services/areaService";

export const AreasFormModal = ({ isModalOpen, onCancel, onSuccess, editingArea }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            if (editingArea) {
                form.setFieldsValue({
                    area: editingArea.area
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingArea, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let response;
            if (editingArea) {
                response = await areaService.update(editingArea.id, values);
            } else {
                response = await areaService.create(values);
            }

            if (response.success) {
                message.success(response.message);
                onSuccess();
                onCancel();
            } else {
                message.error(response.error);
            }
        } catch (error) {
            message.error("Error al guardar el área");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingArea ? "Editar Área" : "Nueva Área"}
            open={isModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingArea ? "Actualizar" : "Guardar"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="area"
                    label="Nombre del Área"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre del área' }]}
                >
                    <Input placeholder="Ej. Administración" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
