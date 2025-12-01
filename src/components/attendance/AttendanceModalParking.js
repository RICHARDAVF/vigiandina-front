'use client'
import { Select, Form } from "antd"
import { Modal } from "antd"

const AttendanceModalParking = ({ isOpen, handleOk, handleCancel, data }) => {
    return (
        <Modal
            open={isOpen}
            title={"Seleccine numero de parqueo"}
            onCancel={handleCancel}
            onOk={handleOk}
            okText={"Registrar"}
            onCancelText={"Cancelar"}

        >
            <Form>
                <Form.Item
                    name="number_parking"
                    label="Número de parque"
                    rules={[{ required: true, message: "Selecciona un parqueo" }]}
                >
                    <Select
                        placeholder="Selecciona un parqueo"
                        options={data}
                        fieldNames={{ "label": "full_status", "value": "id" }}
                        showSearch={true}
                        filterOption={(input, option) => {
                            const searchText = input.toLowerCase();
                            const label = (option?.full_status ?? '').toLowerCase();
                            const id = (option?.id ?? '').toString().toLowerCase();

                            return label.includes(searchText) || id.includes(searchText);
                        }}
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
}
export default AttendanceModalParking