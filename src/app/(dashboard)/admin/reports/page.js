'use client';

import { useState, useEffect } from 'react';
import {
  Row, Col, Card, Typography, Space, Spin, Alert, DatePicker, Select, Button, Table
} from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { dashboardService } from '@/services/dashboardService'; // Will add report functions here

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ReportsPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [dateRange, setDateRange] = useState([]); // [startDate, endDate]
  const [reportType, setReportType] = useState('all'); // 'all', 'ingresos', 'visitas'
  const [reportData, setReportData] = useState({ ingresos_salidas: [], visitas: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await dashboardService.getReportCompanies();
        setCompanies(data);
      } catch (err) {
        setError("Error al cargar la lista de empresas.");
      }
    };
    fetchCompanies();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        report_type: reportType,
      };
      if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
        params.start_date = dateRange[0].format('YYYY-MM-DD');
        params.end_date = dateRange[1].format('YYYY-MM-DD');
      }
      if (selectedCompany) {
        params.company_id = selectedCompany;
      }

      const data = await dashboardService.generateReport(params);
      setReportData(data);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Error al generar el reporte.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (format) => {
    const params = {
      report_type: reportType,
      format: format, // 'pdf' or 'csv'
    };
    if (dateRange.length === 2 && dateRange[0] && dateRange[1]) {
      params.start_date = dateRange[0].format('YYYY-MM-DD');
      params.end_date = dateRange[1].format('YYYY-MM-DD');
    }
    if (selectedCompany) {
      params.company_id = selectedCompany;
    }
    dashboardService.downloadReport(params);
  };

  const getIngresoSalidaColumns = () => [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Trabajador', dataIndex: ['trabajador', 'nombre'], key: 'trabajador_nombre', render: (text, record) => `${record.trabajador.nombre} ${record.trabajador.apellidos}` },
    { title: 'Empresa', dataIndex: ['trabajador', 'empresa', 'razon_social'], key: 'trabajador_empresa' },
    { title: 'Usuario', dataIndex: 'usuario', key: 'usuario' },
    { title: 'Fecha Ingreso', dataIndex: 'fecha_ingreso', key: 'fecha_ingreso' },
    { title: 'Hora Ingreso', dataIndex: 'hora_ingreso', key: 'hora_ingreso' },
    { title: 'Fecha Salida', dataIndex: 'fecha_salida', key: 'fecha_salida' },
    { title: 'Hora Salida', dataIndex: 'hora_salida', key: 'hora_salida' },
    { title: 'Placa', dataIndex: 'placa', key: 'placa' },
    { title: 'Parqueo', dataIndex: 'n_parqueo_numero', key: 'n_parqueo_numero' },
    { title: 'Motivo', dataIndex: 'motivo', key: 'motivo' },
  ];

  const getVisitasColumns = () => [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Autoriza', dataIndex: 'user', key: 'user' },
    { title: 'Tipo Doc.', dataIndex: 'tipo_documento', key: 'tipo_documento' },
    { title: 'DNI', dataIndex: 'dni', key: 'dni' },
    { title: 'Visitante', dataIndex: 'nombre', key: 'visitante_nombre', render: (text, record) => `${record.nombre} ${record.apellidos}` },
    { title: 'Empresa Visitante', dataIndex: 'empresa', key: 'empresa_visitante' },
    { title: 'Cargo Visitante', dataIndex: 'cargo', key: 'cargo_visitante' },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    { title: 'H. Inicio', dataIndex: 'h_inicio', key: 'h_inicio' },
    { title: 'H. Llegada', dataIndex: 'h_llegada', key: 'h_llegada' },
    { title: 'H. Salida', dataIndex: 'h_salida', key: 'h_salida' },
    { title: 'Persona Visitada', dataIndex: ['p_visita', 'nombre'], key: 'p_visita_nombre', render: (text, record) => record.p_visita ? `${record.p_visita.nombre} ${record.p_visita.apellidos}` : '' },
    { title: 'Motivo', dataIndex: 'motivo', key: 'motivo' },
    { title: 'Sala', dataIndex: 'sala_name', key: 'sala_name' },
    { title: 'Tipo Visita', dataIndex: 'tipo', key: 'tipo', render: (text) => text === '1' ? 'VISITA' : 'COURRIER/DELIVERY' },
    { title: 'Estado', dataIndex: 'estado', key: 'estado' },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Reportes</Title>

      <Card>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Rango de Fechas:</Text>
              <RangePicker
                style={{ width: '100%' }}
                onChange={setDateRange}
                value={dateRange}
              />
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Empresa:</Text>
              <Select
                placeholder="Seleccione una empresa"
                style={{ width: '100%' }}
                onChange={setSelectedCompany}
                value={selectedCompany}
                allowClear
              >
                {companies.map(company => (
                  <Option key={company.id} value={company.id}>{company.razon_social}</Option>
                ))}
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Tipo de Reporte:</Text>
              <Select
                placeholder="Seleccione tipo"
                style={{ width: '100%' }}
                onChange={setReportType}
                value={reportType}
              >
                <Option value="all">Todos</Option>
                <Option value="ingresos">Ingresos/Salidas</Option>
                <Option value="visitas">Visitas</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={fetchReport}
              loading={loading}
              style={{ width: '100%' }}
            >
              Generar Reporte
            </Button>
          </Col>
          {/* New Download Buttons */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload('pdf')}
              style={{ width: '100%' }}
              disabled={loading || (reportData.ingresos_salidas.length === 0 && reportData.visitas.length === 0)}
            >
              Descargar PDF
            </Button>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownload('csv')}
              style={{ width: '100%' }}
              disabled={loading || (reportData.ingresos_salidas.length === 0 && reportData.visitas.length === 0)}
            >
              Descargar Excel (CSV)
            </Button>
          </Col>
        </Row>
      </Card>

      {error && <Alert message="Error" description={error} type="error" showIcon />}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Spin size="large" tip="Cargando reporte..." />
        </div>
      ) : (
        <>
          {(reportType === 'all' || reportType === 'ingresos') && reportData.ingresos_salidas.length > 0 && (
            <Card title="Reporte de Ingresos/Salidas" style={{ marginTop: 20 }}>
              <Table
                columns={getIngresoSalidaColumns()}
                dataSource={reportData.ingresos_salidas}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No hay datos de ingresos/salidas para mostrar' }}
              />
            </Card>
          )}

          {(reportType === 'all' || reportType === 'visitas') && reportData.visitas.length > 0 && (
            <Card title="Reporte de Visitas" style={{ marginTop: 20 }}>
              <Table
                columns={getVisitasColumns()}
                dataSource={reportData.visitas}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No hay datos de visitas para mostrar' }}
              />
            </Card>
          )}

          {((reportType === 'all' && reportData.ingresos_salidas.length === 0 && reportData.visitas.length === 0) ||
           (reportType === 'ingresos' && reportData.ingresos_salidas.length === 0) ||
           (reportType === 'visitas' && reportData.visitas.length === 0)) && !loading && !error && (
            <Alert message="Información" description="No se encontraron datos para el reporte con los filtros seleccionados." type="info" showIcon style={{ marginTop: 20 }} />
          )}
        </>
      )}
    </Space>
  );
}
