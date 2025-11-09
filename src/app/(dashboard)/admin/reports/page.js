'use client';

import { Card, Row, Col, Typography, Button, Space, DatePicker } from 'antd';
import { DownloadOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function ReportesPage() {
  const reportes = [
    {
      title: 'Reporte de Ventas',
      description: 'Informe detallado de todas las ventas del período',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Reporte de Usuarios',
      description: 'Análisis de actividad y registro de usuarios',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Reporte Financiero',
      description: 'Estado financiero y análisis de ingresos',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: 'Reporte de Inventario',
      description: 'Estado actual del inventario y productos',
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Reportes</Title>
          <p style={{ color: '#666' }}>Genera y descarga reportes del sistema</p>
        </div>

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Seleccionar período
              </label>
              <RangePicker style={{ width: '100%', maxWidth: 400 }} />
            </div>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          {reportes.map((reporte, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{ height: '100%' }}
                actions={[
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => console.log('Descargar', reporte.title)}
                  >
                    Descargar
                  </Button>,
                ]}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ color: '#1890ff' }}>{reporte.icon}</div>
                  <Title level={4} style={{ margin: 0 }}>
                    {reporte.title}
                  </Title>
                  <p style={{ color: '#666', margin: 0 }}>
                    {reporte.description}
                  </p>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}