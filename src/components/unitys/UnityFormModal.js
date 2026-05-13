'use client';
import { Form, Input, Modal, Select, App } from "antd";
import { useEffect, useState } from "react";
import { unityService } from "@/services/unityService";
import { companyService } from "@/services/companyService";

export const UnityFormModal = ({ isModalOpen, onCancel, onSuccess, editingUnity }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        if (!isModalOpen) return;
        const fetchCompanies = async () => {
            try {
                const response = await companyService.get();
                const list = Array.isArray(response)
                    ? response
                    : response?.results || response?.data || [];
                setCompanies(list);
            } catch {
                message.error("Error al cargar empresas");
            }
        };
        fetchCompanies();

        if (editingUnity) {
            form.setFieldsValue({
                unidad: editingUnity.unidad,
                empresa: editingUnity.empresa?.id ?? editingUnity.empresa,
            });
        } else {
            form.resetFields();
        }
    }, [isModalOpen, editingUnity, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = editingUnity
                ? await unityService.update(editingUnity.id, values)
                : await unityService.create(values);
            if (response.success) {
                message.success(response.message);
                onSuccess();
                onCancel();
            } else {
                message.error(response.error);
            }
        } catch {
            message.error("Error al guardar la unidad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingUnity ? "Editar Unidad" : "Nueva Unidad"}
            open={isModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingUnity ? "Actualizar" : "Guardar"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="unidad"
                    label="Nombre de la Unidad"
                    rules={[{ required: true, message: 'Ingrese el nombre de la unidad' }]}
                >
                    <Input placeholder="Ej. Unidad Lima Norte" />
                </Form.Item>
                <Form.Item
                    name="empresa"
                    label="Empresa"
                    rules={[{ required: true, message: 'Seleccione una empresa' }]}
                >
                    <Select
                        placeholder="Seleccione una empresa"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={companies.map(c => ({
                            label: c.razon_social,
                            value: c.id,
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
