'use client';

import { Layout } from 'antd';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AuthGuard from '@/components/auth/AuthGuard';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout style={{ height: '100vh' }}>
          <Header />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              borderRadius: 8,
              overflow: 'auto',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </AuthGuard>
  );
}