'use client';

import '@ant-design/v5-patch-for-react-19';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { ConfigProvider, App } from 'antd'; // Importar App
import esES from 'antd/locale/es_ES';

export default function Providers({ children }) {
  return (
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: '#EE8931',
          borderRadius: 6,
        },
        components: {
          Menu: {
            darkItemBg: 'transparent',
            darkSubMenuItemBg: 'rgba(0, 0, 0, 0.15)',
            darkItemSelectedBg: 'rgba(0, 0, 0, 0.25)',
          },
        },
      }}
    >
      <App> {/* Envolver con App */}
        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </AuthProvider>
      </App>
    </ConfigProvider>
  );
}
