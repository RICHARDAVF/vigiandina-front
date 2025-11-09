import { Card as AntCard } from 'antd';

export default function Card({ children, ...props }) {
  return <AntCard {...props}>{children}</AntCard>;
}