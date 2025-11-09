/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ['antd'],
  output: 'export', // genera /out con HTML estático
  basePath: '/test',
};

export default nextConfig;
