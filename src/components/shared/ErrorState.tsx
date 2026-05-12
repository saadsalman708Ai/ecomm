import React from 'react';
import { Typography, Button } from 'antd';

const { Title, Text } = Typography;

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title = 'Oops! Something went wrong', message, onRetry }: ErrorStateProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-xl border border-red-100 my-8">
      <Title level={4} className="!mb-2 !text-red-700">{title}</Title>
      {message && <Text className="text-red-500 mb-6">{message}</Text>}
      {onRetry && (
        <Button onClick={onRetry} type="primary" danger>
          Try Again
        </Button>
      )}
    </div>
  );
};
