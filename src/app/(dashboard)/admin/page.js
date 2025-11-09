'use client';

import { Row, Col, Card, Statistic, Typography, Space } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

export default function AdminPage() {
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Dashboard</Title>
          <p style={{ color: '#666' }}>Bienvenido al panel de administración</p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Usuarios"
                value={1128}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ventas Totales"
                value={2345}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Ingresos"
                value={93}
                prefix={<DollarOutlined />}
                suffix="K"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Crecimiento"
                value={11.28}
                prefix={<RiseOutlined />}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Actividad Reciente">
              <p>Gráfico de actividad (próximamente)</p>
              <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', borderRadius: 8 }}>
                <span style={{ color: '#999' }}>Área para gráficos</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Tareas Pendientes">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ padding: '12px', background: '#f0f2f5', borderRadius: 4 }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>Revisar reportes mensuales</p>
                  <small style={{ color: '#666' }}>Hace 2 horas</small>
                </div>
                <div style={{ padding: '12px', background: '#f0f2f5', borderRadius: 4 }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>Actualizar base de datos</p>
                  <small style={{ color: '#666' }}>Hace 5 horas</small>
                </div>
                <div style={{ padding: '12px', background: '#f0f2f5', borderRadius: 4 }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>Reunión de equipo</p>
                  <small style={{ color: '#666' }}>Mañana 10:00 AM</small>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
}