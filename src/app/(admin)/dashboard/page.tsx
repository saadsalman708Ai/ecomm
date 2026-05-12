import React from 'react';
import { DashboardMenu } from '../../../components/admin/dashboard/DashboardMenu';
import { useAuth } from '../../../hooks/useAuth';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  
  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-8 flex-1 flex flex-col gap-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-foreground-muted">Welcome back, {user?.email}</p>
      </div>
      
      <DashboardMenu />
    </div>
  );
}
