'use client';

import { Card, Form, Input, Button, Switch, Select, Space, Typography, Divider, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ConfiguracionPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Valores:', values);
    message.success('Configuración guardada correctamente');
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Configuración</Title>
          <Text type="secondary">Configura los parámetros del sistema</Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'Mi Sitio Web',
            siteDescription: 'Descripción de mi sitio',
            email: 'contacto@example.com',
            language: 'es',
            notifications: true,
            darkMode: false,
          }}
        >
          <Card title="Información General" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Nombre del Sitio"
              name="siteName"
              rules={[{ required: true, message: 'Ingresa el nombre del sitio' }]}
            >
              <Input placeholder="Nombre del sitio" />
            </Form.Item>

            <Form.Item
              label="Descripción"
              name="siteDescription"
            >
              <TextArea rows={4} placeholder="Descripción del sitio" />
            </Form.Item>

            <Form.Item
              label="Email de Contacto"
              name="email"
              rules={[
                { required: true, message: 'Ingresa el email' },
                { type: 'email', message: 'Email inválido' },
              ]}
            >
              <Input placeholder="contacto@example.com" />
            </Form.Item>

            <Form.Item
              label="Idioma"
              name="language"
            >
              <Select>
                <Select.Option value="es">Español</Select.Option>
                <Select.Option value="en">English</Select.Option>
                <Select.Option value="pt">Português</Select.Option>
              </Select>
            </Form.Item>
          </Card>

          <Card title="Preferencias" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Notificaciones"
              name="notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Modo Oscuro"
              name="darkMode"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Card>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                size="large"
              >
                Guardar Cambios
              </Button>
            </Form.Item>
          </Card>
        </Form>
      </Space>
    </div>
  );
}
