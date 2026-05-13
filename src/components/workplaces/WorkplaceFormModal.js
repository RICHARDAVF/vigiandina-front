'use client';
import { Form, Input, Modal, Select, App } from "antd";
import { useEffect, useState } from "react";
import { workplaceService } from "@/services/workplaceService";
import { unityService } from "@/services/unityService";

export const WorkplaceFormModal = ({ isModalOpen, onCancel, onSuccess, editingWorkplace }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [unitys, setUnitys] = useState([]);

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchUnitys = async () => {
            try {
                const response = await unityService.list(1, 100, '');
                setUnitys(response.results || []);
            } catch {
                message.error("Error al cargar unidades");
            }
        };
        fetchUnitys();

        if (editingWorkplace) {
            form.setFieldsValue({
                puesto: editingWorkplace.puesto,
                direccion: editingWorkplace.direccion,
                unidad: editingWorkplace.unidad,
            });
        } else {
            form.resetFields();
        }
    }, [isModalOpen, editingWorkplace, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = editingWorkplace
                ? await workplaceService.update(editingWorkplace.id, values)
                : await workplaceService.create(values);
            if (response.success) {
                message.success(response.message);
                onSuccess();
                onCancel();
            } else {
                message.error(response.error);
            }
        } catch {
            message.error("Error al guardar el puesto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingWorkplace ? "Editar Puesto" : "Nuevo Puesto"}
            open={isModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingWorkplace ? "Actualizar" : "Guardar"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="puesto"
                    label="Nombre del Puesto"
                    rules={[{ required: true, message: 'Ingrese el nombre del puesto' }]}
                >
                    <Input placeholder="Ej. Puesto Norte" />
                </Form.Item>
                <Form.Item
                    name="direccion"
                    label="Dirección"
                    rules={[{ required: true, message: 'Ingrese la dirección' }]}
                >
                    <Input placeholder="Ej. Av. Principal 123" />
                </Form.Item>
                <Form.Item
                    name="unidad"
                    label="Unidad"
                    rules={[{ required: true, message: 'Seleccione una unidad' }]}
                >
                    <Select
                        placeholder="Seleccione una unidad"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={unitys.map(u => ({
                            label: `${u.empresa?.razon_social || ''} — ${u.unidad}`,
                            value: u.id,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
