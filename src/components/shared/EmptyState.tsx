import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-xl my-8">
      <Title level={4} className="!mb-2 !text-gray-700">{title}</Title>
      {description && <Text className="text-gray-500 mb-6">{description}</Text>}
      {action && <div>{action}</div>}
    </div>
  );
};
