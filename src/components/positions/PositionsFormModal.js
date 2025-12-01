'use client';
import { Form, Input, Modal, Select, App } from "antd";
import { useEffect, useState } from "react";
import { positionService } from "@/services/positionService";
import { areaService } from "@/services/areaService";

export const PositionsFormModal = ({ isModalOpen, onCancel, onSuccess, editingPosition }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetchAndSetData = async () => {
            if (isModalOpen) {
                try {
                    // 1. Fetch all areas
                    const response = await areaService.list(1, 100, "");
                    let areaOptions = response.results || [];

                    // 2. If editing, ensure the specific area from the record is in the list
                    if (editingPosition) {
                        const { worklace } = editingPosition; // Use the new 'worklace' field

                        // The 'worklace' object is {id, area}, which is compatible with the Select's mapping.
                        // Add it to the options if it's not already present.
                        if (worklace && !areaOptions.some(a => a.id === worklace.id)) {
                            areaOptions.unshift(worklace);
                        }

                        // 3. Now set the form values
                        form.setFieldsValue({
                            cargo: editingPosition.cargo,
                            area_id: worklace?.id, // Use the ID from the new worklace object
                        });
                    } else {
                        form.resetFields();
                    }

                    setAreas(areaOptions);

                } catch (error) {
                    console.error("Error fetching areas:", error);
                    message.error("Error al cargar áreas");
                }
            }
        };

        if (isModalOpen) {
            fetchAndSetData();
        }
    }, [isModalOpen, editingPosition, form, message]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let response;
            if (editingPosition) {
                response = await positionService.update(editingPosition.id, values);
            } else {
                response = await positionService.create(values);
            }

            if (response.success) {
                message.success(response.message);
                onSuccess();
                onCancel();
            } else {
                message.error(response.error);
            }
        } catch (error) {
            message.error("Error al guardar el cargo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editingPosition ? "Editar Cargo" : "Nuevo Cargo"}
            open={isModalOpen}
            onCancel={onCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText={editingPosition ? "Actualizar" : "Guardar"}
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="cargo"
                    label="Nombre del Cargo"
                    rules={[{ required: true, message: 'Por favor ingrese el nombre del cargo' }]}
                >
                    <Input placeholder="Ej. Supervisor" />
                </Form.Item>
                <Form.Item
                    name="area_id"
                    label="Área de Trabajo"
                    rules={[{ required: true, message: 'Por favor seleccione un área' }]}
                >
                    <Select
                        placeholder="Seleccione un área"
                        options={areas.map(area => ({ label: area.area, value: area.id }))}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
