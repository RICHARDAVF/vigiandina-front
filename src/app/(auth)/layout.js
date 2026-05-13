'use client';
import { Layout } from 'antd';

const { Content } = Layout;

export default function AuthLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #EE8931 0%, #7F060B 100%)',
          padding: '20px',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}