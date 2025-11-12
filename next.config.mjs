/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  transpilePackages: ['antd'],
  output: 'export', 
  basePath: '/test',
};

export default nextConfig;
