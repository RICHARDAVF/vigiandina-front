'use client';

import { use, useContext, useEffect } from 'react';
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
import { PERMISSIONS } from '@/utils/constants';
const { Sider } = Layout;

const menuItems = [
  {
    key: ROUTES.ADMIN,
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    permission:PERMISSIONS.PERMITTED
  },
  {
    key: ROUTES.ADMIN_USUARIOS,
    icon: <UserOutlined />,
    label: 'Usuarios',
    permission:PERMISSIONS.NO_PERMITTED

  },
  {
    key: ROUTES.ADMIN_WORKPLACES,
    icon: <BorderLeftOutlined />,
    label: 'Puestos de vigilancia',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_UNITYS,
    icon: <BorderLeftOutlined />,
    label: 'Unidades',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_AREAS,
    icon: <BorderLeftOutlined />,
    label: 'Areas',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_PARKING,
    icon: <BorderLeftOutlined />,
    label: 'Parqueos',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_COMPANIES,
    icon: <BorderLeftOutlined/>,
    label: 'Empresas',
    permission:PERMISSIONS.NO_PERMITTED

  },
  {
    key: ROUTES.ADMIN_POSITIONS,
    icon: <BorderLeftOutlined/>,
    label: 'Cargos',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_COLLABORATORS,
    icon: <UserOutlined />,
    label: 'Trabajadores',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_ATTENDACE,
    icon: <UsergroupAddOutlined />,
    label: 'Ingreso de personal',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_VISITS,
    icon: <UsergroupAddOutlined />,
    label: 'Ingreso de visitas',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_REPORTES,
    icon: <FileTextOutlined />,
    label: 'Reportes',
    permission:PERMISSIONS.PERMITTED

  },
  {
    key: ROUTES.ADMIN_CONFIGURACION,
    icon: <SettingOutlined />,
    label: 'Configuración',
    permission:PERMISSIONS.NO_PERMITTED

  },
];


export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, mobileOpen, isMobile, setIsMobile, closeMobileSidebar } = useContext(SidebarContext);
  const {user} = useContext(AuthContext)
  const MENU = menuItems
    .filter(item => user.is_superuser || item.permission === true)
    .map(({ permission, ...rest }) => rest);


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
          items={MENU}
          onClick={handleMenuClick}
          style={{ marginTop: 16 }}
        />
      </Sider>
    </>
  );
}