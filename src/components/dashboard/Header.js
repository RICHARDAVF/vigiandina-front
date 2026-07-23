'use client';

import { useContext, useState, useEffect } from 'react';
import { Layout, Button, Space, Avatar, Dropdown } from 'antd';
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { SidebarContext } from '@/context/SidebarContext';
import Image from 'next/image';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useContext(SidebarContext);
  const [fechaHora, setFechaHora] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const ahora = new Date();
      const diaSemana = ahora.toLocaleString('es-ES', { weekday: 'long' });
      const dia = ahora.toLocaleString('es-ES', { day: 'numeric' });
      const mes = ahora.toLocaleString('es-ES', { month: 'long' });
      const ano = ahora.toLocaleString('es-ES', { year: 'numeric' });
      const hora = ahora.toLocaleString('es-ES', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      });

      const formatted = `${diaSemana}, ${dia} de ${mes} de ${ano}, ${hora}`;
      // Capitalize first letter of day of week
      setFechaHora(formatted.charAt(0).toUpperCase() + formatted.slice(1));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Mi Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configuración',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar Sesión',
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Space size="middle" align="center">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{ fontSize: 16 }}
        />
      </Space>

      <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
        <strong style={{ fontSize: 14, color: '#333' }}>{fechaHora}</strong>
      </div>

      <Space size="middle">
        <span style={{ color: '#666' }}>
          Hola, <strong>{user?.username || 'Usuario'}</strong>
        </span>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Avatar
            icon={<UserOutlined />}
            src={user?.avatar}
            style={{ cursor: 'pointer', backgroundColor: '#EE8931' }}
          />
        </Dropdown>
      </Space>
    </AntHeader>
  );
}