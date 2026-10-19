import React from 'react';
import Card, { CardHeader } from '../ui/Card';

export function ChartCard({
  title,
  subtitle,
  children,
  action,
  className = '',
  height = 'h-72',
}) {
  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader title={title} subtitle={subtitle} action={action} />
      <div className={`w-full ${height} mt-2`}>{children}</div>
    </Card>
  );
}

export default ChartCard;
