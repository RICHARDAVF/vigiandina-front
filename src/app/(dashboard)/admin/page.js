'use client';

import { Row, Col, Card, Statistic, Typography, Space, Spin, Alert, Modal, Table } from 'antd';
import {
  UserOutlined,
  CarOutlined,
  LoginOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { dashboardService } from '@/services/dashboardService';
import { Pie, Column, Line } from '@ant-design/charts';

const { Title, Text } = Typography;

export default function AdminPage() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalContentType, setModalContentType] = useState(''); // To help define columns

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardStats();
        setDashboardStats(data);
      } catch (err) {
        setError('Error al cargar las estadísticas del dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fetchAndShowDetails = async (type) => {
    setModalLoading(true);
    setIsModalVisible(true);
    setModalContent([]); // Clear previous content
    setModalContentType(type); // Set the type for column definition

    let data = [];
    let title = '';

    try {
      switch (type) {
        case 'workers_inside':
          data = await dashboardService.getWorkersInsideList();
          title = 'Trabajadores Actualmente Dentro';
          break;
        case 'visitors_inside':
          data = await dashboardService.getVisitorsInsideList();
          title = 'Visitantes Actualmente Dentro';
          break;
        case 'worker_entries_today':
          data = await dashboardService.getWorkerEntriesTodayList();
          title = 'Entradas de Trabajadores Hoy';
          break;
        case 'total_visits_today':
          data = await dashboardService.getTotalVisitsTodayList();
          title = 'Visitas Registradas Hoy';
          break;
        default:
          break;
      }
      setModalContent(data);
      setModalTitle(title);
    } catch (err) {
      console.error(`Error fetching ${type} details:`, err);
      setModalTitle(`Error al cargar ${title.toLowerCase()}`);
      setModalContent([{ id: 'error', message: 'No se pudieron cargar los detalles.' }]);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent([]);
    setModalTitle('');
    setModalContentType('');
  };

  // Define columns dynamically based on the content type
  const getModalColumns = (type) => {
    switch (type) {
      case 'workers_inside':
        return [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Documento', dataIndex: 'documento', key: 'documento' },
          { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
          { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
          { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
          { title: 'Empresa', dataIndex: 'empresa', key: 'empresa' },
          { title: 'Área', dataIndex: 'area', key: 'area' },
          { title: 'Cargo', dataIndex: 'cargo', key: 'cargo' },
          { title: 'Estado', dataIndex: 'estado', key: 'estado', render: (text) => (text ? 'Activo' : 'Inactivo') },
        ];
      case 'visitors_inside':
      case 'total_visits_today':
        return [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'DNI', dataIndex: 'dni', key: 'dni' },
          { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
          { title: 'Apellidos', dataIndex: 'apellidos', key: 'apellidos' },
          { title: 'Empresa', dataIndex: 'empresa', key: 'empresa' },
          { title: 'Cargo', dataIndex: 'cargo', key: 'cargo' },
          { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
          { title: 'H. Inicio', dataIndex: 'h_inicio', key: 'h_inicio' },
          { title: 'H. Llegada', dataIndex: 'h_llegada', key: 'h_llegada' },
          { title: 'H. Salida', dataIndex: 'h_salida', key: 'h_salida' },
          { title: 'Motivo', dataIndex: 'motivo', key: 'motivo' },
          { title: 'Persona Visitada', dataIndex: 'p_visita', key: 'p_visita' },
          { title: 'Sala', dataIndex: 'sala', key: 'sala' },
          { title: 'Estado', dataIndex: 'estado', key: 'estado', render: (text) => {
            if (text === '1') return 'PROGRAMADO';
            if (text === '2') return 'EN CURSO';
            if (text === '3') return 'FINALIZADO';
            return text;
          }},
          { title: 'Tipo', dataIndex: 'tipo', key: 'tipo', render: (text) => (text === '1' ? 'VISITA' : 'COURRIER/DELIVERY') },
        ];
      case 'worker_entries_today':
        return [
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'Nombre', dataIndex: 'trabajador_nombre', key: 'trabajador_nombre' },
          { title: 'Apellidos', dataIndex: 'trabajador_apellidos', key: 'trabajador_apellidos' },
          { title: 'Empresa', dataIndex: 'trabajador_empresa', key: 'trabajador_empresa' },
          { title: 'F. Ingreso', dataIndex: 'fecha_ingreso', key: 'fecha_ingreso' },
          { title: 'H. Ingreso', dataIndex: 'hora_ingreso', key: 'hora_ingreso' },
          { title: 'F. Salida', dataIndex: 'fecha_salida', key: 'fecha_salida' },
          { title: 'H. Salida', dataIndex: 'hora_salida', key: 'hora_salida' },
          { title: 'Placa', dataIndex: 'placa', key: 'placa' },
          { title: 'Parqueo', dataIndex: 'n_parqueo_numero', key: 'n_parqueo_numero' },
          { title: 'Motivo', dataIndex: 'motivo', key: 'motivo' },
        ];
      default:
        return [];
    }
  };
// Chart configurations
  const visitTypePieConfig = {
    appendPadding: 10,
    data: dashboardStats?.chart_data?.visit_type_distribution || [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const visitStatusPieConfig = {
    appendPadding: 10,
    data: dashboardStats?.chart_data?.visit_status_distribution_today || [],
    angleField: 'value',
    colorField: 'status',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{value}',
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
    interactions: [{ type: 'element-active' }],
  };
  // Prepare data for daily activity column chart
  const dailyActivityChartData = [];
  if (dashboardStats?.daily_stats) {
    dashboardStats.daily_stats.dates.forEach((date, index) => {
      dailyActivityChartData.push({
        date: date,
        category: 'Entradas Trabajadores',
        value: dashboardStats.daily_stats.worker_entries[index],
      });
      dailyActivityChartData.push({
        date: date,
        category: 'Visitas',
        value: dashboardStats.daily_stats.visits[index],
      });
    });
  }

  const dailyActivityColumnConfig = {
    data: dailyActivityChartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    interactions: [{ type: 'active-region', enable: false }],
  };

  // Prepare data for worker entries line chart
  const workerEntriesLineChartData = [];
  if (dashboardStats?.daily_stats) {
    dashboardStats.daily_stats.dates.forEach((date, index) => {
      workerEntriesLineChartData.push({
        date: date,
        value: dashboardStats.daily_stats.worker_entries[index],
      });
    });
  }

  const workerEntriesLineConfig = {
    data: workerEntriesLineChartData,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: false,
    },
    interactions: [{ type: 'marker-active' }],
  };

  // Prepare data for visits line chart
  const visitsLineChartData = [];
  if (dashboardStats?.daily_stats) {
    dashboardStats.daily_stats.dates.forEach((date, index) => {
      visitsLineChartData.push({
        date: date,
        value: dashboardStats.daily_stats.visits[index],
      });
    });
  }

  const visitsLineConfig = {
    data: visitsLineChartData,
    xField: 'date',
    yField: 'value',
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: false,
    },
    interactions: [{ type: 'marker-active' }],
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Spin size="large" tip="Cargando estadísticas..." />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Dashboard</Title>
          <p style={{ color: '#666' }}>Bienvenido al panel de administración</p>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable onClick={() => fetchAndShowDetails('workers_inside')}>
              <Statistic
                title="Trabajadores Dentro"
                value={dashboardStats?.workers_inside ?? 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable onClick={() => fetchAndShowDetails('visitors_inside')}>
              <Statistic
                title="Visitantes Dentro"
                value={dashboardStats?.visitors_inside ?? 0}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable onClick={() => fetchAndShowDetails('worker_entries_today')}>
              <Statistic
                title="Entradas Hoy"
                value={dashboardStats?.worker_entries_today ?? 0}
                prefix={<LoginOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card hoverable onClick={() => fetchAndShowDetails('total_visits_today')}>
              <Statistic
                title="Visitas Hoy"
                value={dashboardStats?.total_visits_today ?? 0}
                prefix={<CarOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        {/* New Row for Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Visitas por Tipo">
              <div style={{ height: 250 }}>
                <Pie {...visitTypePieConfig} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Estado de Visitas Hoy">
              <div style={{ height: 250 }}>
                <Pie {...visitStatusPieConfig} />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Actividad Diaria">
              <div style={{ height: 250 }}>
                <Column {...dailyActivityColumnConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* New Row for Line Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Entradas de Trabajadores (Últimos 7 días)">
              <div style={{ height: 250 }}>
                <Line {...workerEntriesLineConfig} />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Visitas Registradas (Últimos 7 días)">
              <div style={{ height: 250 }}>
                <Line {...visitsLineConfig} />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Actividad Diaria (Últimos 7 días)">
              {dashboardStats?.daily_stats ? (
                <div style={{ height: 300, overflowY: 'auto' }}>
                  {dashboardStats.daily_stats.dates.map((date, index) => (
                    <div key={date} style={{ marginBottom: '8px', padding: '8px', background: '#f0f2f5', borderRadius: 4 }}>
                      <Text strong>{date}:</Text>
                      <br />
                      <Text>Entradas de Trabajadores: {dashboardStats.daily_stats.worker_entries[index]}</Text>
                      <br />
                      <Text>Visitas: {dashboardStats.daily_stats.visits[index]}</Text>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay datos de actividad diaria disponibles.</p>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Tipos de Visita Hoy">
              <Space direction="vertical" style={{ width: '100%' }}>
                {dashboardStats?.visit_types_today && Object.keys(dashboardStats.visit_types_today).length > 0 ? (
                  Object.entries(dashboardStats.visit_types_today).map(([type, count]) => (
                    <div key={type} style={{ padding: '12px', background: '#f0f2f5', borderRadius: 4 }}>
                      <p style={{ margin: 0, fontWeight: 500 }}>
                        {type === '1' ? 'Visitas Regulares' : type === '2' ? 'Courrier/Delivery' : `Tipo ${type}`}: {count}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No hay tipos de visita registrados hoy.</p>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000} // Increased width for better table display
      >
        {modalLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
            <Spin />
          </div>
        ) : (
          <Table
            columns={getModalColumns(modalContentType)}
            dataSource={modalContent}
            rowKey="id"
            scroll={{ x: 'max-content', y: 400 }} // Horizontal and vertical scroll
            pagination={{ pageSize: 10 }} // Basic pagination
            locale={{ emptyText: 'No hay datos para mostrar' }}
          />
        )}
      </Modal>
    </div>
  );
}
