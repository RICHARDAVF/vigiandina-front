'use client';

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
          colorPrimary: '#1890ff',
          borderRadius: 6,
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
