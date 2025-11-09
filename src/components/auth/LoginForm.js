'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { validateUsername, validatePassword } from '@/utils/validators';

const { Title, Text } = Typography;

export default function LoginForm() {
    const [form] = Form.useForm();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onFinish = async (values) => {
        setLoading(true);
        setError('');

        const passwordError = validatePassword(values.password);

        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        try {
            const result = await login(values);
            if (!result.success) {
                setError(result.error || 'Error al iniciar sesión');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: '100%',
                maxWidth: 400,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Title level={2}>Bienvenido</Title>
                <Text type="secondary">Ingresa a tu cuenta</Text>
            </div>

            {error && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError('')}
                    style={{ marginBottom: 16 }}
                />
            )}

            
            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name="username"
                    label="Usuario"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu email' },
                       
                    ]}
                >
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nombre de usuario"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[
                        { required: true, message: 'Por favor ingresa tu contraseña' },
                        { min: 6, message: 'Mínimo 6 caracteres' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Contraseña"
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Iniciar Sesión
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Text type="secondary">
                    ¿Olvidaste tu contraseña?{' '}
                    <a href="#">Recuperar</a>
                </Text>
            </div>
        </Card>
    );
}