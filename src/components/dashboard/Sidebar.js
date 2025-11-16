'use client';

import { useContext, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,UsergroupAddOutlined,
  SettingOutlined,
  FileTextOutlined,
  BorderLeftOutlined
  
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarContext } from '@/context/SidebarContext';
import { ROUTES } from '@/utils/constants';
import { AuthContext } from '@/context/AuthContext';
const { Sider } = Layout;

const menuItems = [
  {
    key: ROUTES.ADMIN,
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: ROUTES.ADMIN_USUARIOS,
    icon: <UserOutlined />,
    label: 'Usuarios',
  },
  {
    key: ROUTES.ADMIN_WORKPLACES,
    icon: <BorderLeftOutlined />,
    label: 'Puestos de vigilancia',
  },
  {
    key: ROUTES.ADMIN_UNITYS,
    icon: <BorderLeftOutlined />,
    label: 'Unidades',
  },
  {
    key: ROUTES.ADMIN_AREAS,
    icon: <BorderLeftOutlined />,
    label: 'Areas',
  },
  {
    key: ROUTES.ADMIN_PARKING,
    icon: <BorderLeftOutlined />,
    label: 'Parqueos',
  },
  {
    key: ROUTES.ADMIN_COMPANIES,
    icon: <BorderLeftOutlined/>,
    label: 'Empresas',
  },
  {
    key: ROUTES.ADMIN_POSITIONS,
    icon: <BorderLeftOutlined/>,
    label: 'Cargos',
  },
  {
    key: ROUTES.ADMIN_COLLABORATORS,
    icon: <UserOutlined />,
    label: 'Trabajadores',
  },
  {
    key: ROUTES.ADMIN_ATTENDACE,
    icon: <UsergroupAddOutlined />,
    label: 'Ingreso de personal',
  },
  {
    key: ROUTES.ADMIN_VISITS,
    icon: <UsergroupAddOutlined />,
    label: 'Ingreso de visitas',
  },
  {
    key: ROUTES.ADMIN_REPORTES,
    icon: <FileTextOutlined />,
    label: 'Reportes',
  },
  {
    key: ROUTES.ADMIN_CONFIGURACION,
    icon: <SettingOutlined />,
    label: 'Configuración',
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, mobileOpen, isMobile, setIsMobile, closeMobileSidebar } = useContext(SidebarContext);
  const {user} = useContext(AuthContext)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  const handleMenuClick = ({ key }) => {
    router.push(key);
    closeMobileSidebar();
  };

  return (
    <>
      {isMobile && mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 998,
          }}
          onClick={closeMobileSidebar}
        />
      )}

      <Sider
        trigger={null}
        collapsible
        collapsed={isMobile ? false : collapsed}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        width={250}
        style={{
          position: isMobile ? 'fixed' : 'relative',
          left: isMobile && !mobileOpen ? -250 : 0,
          height: '100vh',
          zIndex: 999,
          transition: 'all 0.2s',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {(isMobile || !collapsed) ? 'Admin Panel' : 'AP'}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ marginTop: 16 }}
        />
      </Sider>
    </>
  );
}