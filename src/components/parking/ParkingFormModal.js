'use client';
import { Form, Input, Modal, Switch, App } from "antd";
import { useEffect, useState } from "react";
import { parkingService } from "@/services/parkingService";

export const ParkingFormModal = ({ isModalOpen, onCancel, onSuccess, editingParking }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isModalOpen) return;
        if (editingParking) {
            form.setFieldsValue({
                numero: editingParking.numero,
                nombre: editingParking.nombre,
                estado: editingParking.estado,
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ estado: true });
        }
    }, [isModalOpen, editingParking, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = editingParking
                ? await parkingService.update(editingParking.id, values)
                : await parkingService.create(values);
            if (response.success) {
                message.success(response.message);
                onSuccess();
                onCancel();
            } else {
                message.error(response.error);
            }
        } catch {
            message.error("Error al guardar el parqueo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingParking ? "Editar Parqueo" : "Nuevo Parqueo"}
            open={isModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingParking ? "Actualizar" : "Guardar"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="numero"
                    label="Número"
                    rules={[{ required: true, message: 'Ingrese el número del parqueo' }]}
                >
                    <Input placeholder="Ej. P-01" />
                </Form.Item>
                <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: 'Ingrese el nombre del parqueo' }]}
                >
                    <Input placeholder="Ej. Zona A" />
                </Form.Item>
                <Form.Item name="estado" label="Estado" valuePropName="checked">
                    <Switch checkedChildren="Libre" unCheckedChildren="Ocupado" />
                </Form.Item>
            </Form>
        </Modal>
    );
};
