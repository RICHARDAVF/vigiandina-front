'use client';

import {
  Tabs,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  Space,
  Typography,
  Tag,
  App,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  BankOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { userConfigService } from '@/services/userConfigService';
import { userService } from '@/services/userService';
import { companyService } from '@/services/companyService';

const { Title, Text } = Typography;

export default function ConfiguracionPage() {
  const { message, modal } = App.useApp();

  const [userEmpresas, setUserEmpresas] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState({ empresas: false, supervisores: false });
  const [modalEmpresa, setModalEmpresa] = useState(false);
  const [modalSupervisor, setModalSupervisor] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formEmpresa] = Form.useForm();
  const [formSupervisor] = Form.useForm();

  const fetchUserEmpresas = useCallback(async () => {
    setLoading((prev) => ({ ...prev, empresas: true }));
    try {
      const res = await userConfigService.listUserEmpresas();
      setUserEmpresas(res?.data ?? []);
    } catch {
      message.error('Error al cargar empresas asignadas');
    } finally {
      setLoading((prev) => ({ ...prev, empresas: false }));
    }
  }, []);

  const fetchSupervisores = useCallback(async () => {
    setLoading((prev) => ({ ...prev, supervisores: true }));
    try {
      const res = await userConfigService.listUserSupervisor();
      setSupervisores(res?.data ?? []);
    } catch {
      message.error('Error al cargar asignaciones de supervisor');
    } finally {
      setLoading((prev) => ({ ...prev, supervisores: false }));
    }
  }, []);

  const fetchCatalogs = useCallback(async () => {
    try {
      const [usersRes, companiesRes] = await Promise.all([
        userService.list(),
        companyService.get(),
      ]);
      setUsers(usersRes?.data ?? []);
      setCompanies(
        Array.isArray(companiesRes) ? companiesRes
          : companiesRes?.results ?? companiesRes?.data ?? []
      );
    } catch {
      message.error('Error al cargar catálogos');
    }
  }, []);

  useEffect(() => {
    fetchUserEmpresas();
    fetchSupervisores();
    fetchCatalogs();
  }, [fetchUserEmpresas, fetchSupervisores, fetchCatalogs]);

  // --- Empresas ---
  const handleDeleteEmpresa = (record) => {
    modal.confirm({
      title: '¿Eliminar esta asignación?',
      content: `Se quitará la empresa "${record.empresa_nombre}" del usuario "${record.usuario_username}".`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        const res = await userConfigService.deleteUserEmpresa(record.id);
        if (res?.success) {
          message.success('Asignación eliminada');
          fetchUserEmpresas();
        } else {
          message.error(res?.error || 'Error al eliminar la asignación');
        }
      },
    });
  };

  const handleSaveEmpresa = async (values) => {
    setSaving(true);
    try {
      const res = await userConfigService.createUserEmpresa(values);
      if (res?.success) {
        message.success('Empresa asignada correctamente');
        setModalEmpresa(false);
        formEmpresa.resetFields();
        fetchUserEmpresas();
      } else {
        message.error(res?.error || 'Error al asignar empresa (puede ser una asignación duplicada)');
      }
    } finally {
      setSaving(false);
    }
  };

  const empresasColumns = [
    {
      title: 'Usuario',
      key: 'usuario',
      render: (_, record) => (
        <span>
          <Text strong>{record.usuario_username}</Text>
          {record.usuario_nombre && (
            <Text type="secondary"> — {record.usuario_nombre}</Text>
          )}
        </span>
      ),
    },
    {
      title: 'Empresa',
      dataIndex: 'empresa_nombre',
      key: 'empresa_nombre',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmpresa(record)}
          />
        </Space>
      ),
    },
  ];

  // --- Supervisores ---
  const handleDeleteSupervisor = (record) => {
    modal.confirm({
      title: '¿Eliminar esta asignación?',
      content: `Se eliminará la supervisión de "${record.supervisor_username}" sobre "${record.supervised_user_username}".`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        const res = await userConfigService.deleteUserSupervisor(record.id);
        if (res?.success) {
          message.success('Asignación eliminada');
          fetchSupervisores();
        } else {
          message.error(res?.error || 'Error al eliminar la asignación');
        }
      },
    });
  };

  const handleSaveSupervisor = async (values) => {
    setSaving(true);
    try {
      const res = await userConfigService.createUserSupervisor(values);
      if (res?.success) {
        message.success('Supervisor asignado correctamente');
        setModalSupervisor(false);
        formSupervisor.resetFields();
        fetchSupervisores();
      } else {
        message.error(res?.error || 'Error al asignar supervisor (puede ser una asignación duplicada)');
      }
    } finally {
      setSaving(false);
    }
  };

  const supervisoresColumns = [
    {
      title: 'Supervisor',
      key: 'supervisor',
      render: (_, record) => (
        <span>
          <Text strong>{record.supervisor_username}</Text>
          {record.supervisor_nombre && (
            <Text type="secondary"> — {record.supervisor_nombre}</Text>
          )}
        </span>
      ),
    },
    {
      title: 'Usuario supervisado',
      key: 'supervised_user',
      render: (_, record) => (
        <span>
          <Text strong>{record.supervised_user_username}</Text>
          {record.supervised_user_nombre && (
            <Text type="secondary"> — {record.supervised_user_nombre}</Text>
          )}
        </span>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 80,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteSupervisor(record)}
          />
        </Space>
      ),
    },
  ];

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.username}${u.last_name ? ` — ${u.last_name} ${u.first_name ?? ''}`.trim() : ''}`,
  }));

  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: c.razon_social,
  }));

  const tabItems = [
    {
      key: 'empresas',
      label: (
        <span>
          <BankOutlined /> Empresas por usuario
        </span>
      ),
      children: (
        <Card
          title="Empresas asignadas"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalEmpresa(true)}
            >
              Asignar empresa
            </Button>
          }
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Permite que un usuario acceda a los datos de más de una empresa.
          </Text>
          <Table
            rowKey="id"
            dataSource={userEmpresas}
            columns={empresasColumns}
            loading={loading.empresas}
            size="small"
            locale={{ emptyText: 'Sin asignaciones' }}
            pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (total) => `Total ${total} registros` }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      ),
    },
    {
      key: 'supervisores',
      label: (
        <span>
          <TeamOutlined /> Supervisores
        </span>
      ),
      children: (
        <Card
          title="Asignaciones de supervisor"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalSupervisor(true)}
            >
              Asignar supervisor
            </Button>
          }
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Define qué usuarios están bajo la supervisión de otro usuario.
          </Text>
          <Table
            rowKey="id"
            dataSource={supervisores}
            columns={supervisoresColumns}
            loading={loading.supervisores}
            size="small"
            locale={{ emptyText: 'Sin asignaciones' }}
            pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (total) => `Total ${total} registros` }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>Configuración</Title>
          <Text type="secondary">Gestión de accesos y supervisión de usuarios</Text>
        </div>

        <Tabs defaultActiveKey="empresas" items={tabItems} />
      </Space>

      {/* Modal: asignar empresa a usuario */}
      <Modal
        title="Asignar empresa a usuario"
        open={modalEmpresa}
        onCancel={() => { setModalEmpresa(false); formEmpresa.resetFields(); }}
        onOk={() => formEmpresa.submit()}
        okText="Asignar"
        confirmLoading={saving}
      >
        <Form form={formEmpresa} layout="vertical" onFinish={handleSaveEmpresa}>
          <Form.Item
            name="usuario"
            label="Usuario"
            rules={[{ required: true, message: 'Selecciona un usuario' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar usuario"
              options={userOptions}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="empresa"
            label="Empresa"
            rules={[{ required: true, message: 'Selecciona una empresa' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar empresa"
              options={companyOptions}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: asignar supervisor */}
      <Modal
        title="Asignar supervisor"
        open={modalSupervisor}
        onCancel={() => { setModalSupervisor(false); formSupervisor.resetFields(); }}
        onOk={() => formSupervisor.submit()}
        okText="Asignar"
        confirmLoading={saving}
      >
        <Form form={formSupervisor} layout="vertical" onFinish={handleSaveSupervisor}>
          <Form.Item
            name="supervisor"
            label="Supervisor"
            rules={[{ required: true, message: 'Selecciona el supervisor' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar supervisor"
              options={userOptions}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            name="supervised_user"
            label="Usuario supervisado"
            rules={[{ required: true, message: 'Selecciona el usuario a supervisar' }]}
          >
            <Select
              showSearch
              placeholder="Seleccionar usuario supervisado"
              options={userOptions}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
