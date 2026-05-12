import React from 'react';
import { Package, PlusSquare, LayoutTemplate, Phone, Settings, Truck, Tags } from 'lucide-react';
import { DashboardMenuItem } from './DashboardMenuItem';

export const DashboardMenu = () => {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      <DashboardMenuItem icon={<Package />} label="Orders" to="/dashboard/orders" />
      <DashboardMenuItem icon={<PlusSquare />} label="Add Product" to="/dashboard/products/add" />
      <DashboardMenuItem icon={<Settings />} label="Manage Products" to="/dashboard/products" />
      <DashboardMenuItem icon={<Tags />} label="Manage Categories" to="/dashboard/categories" />
      <DashboardMenuItem icon={<LayoutTemplate />} label="Edit Home Page" to="/dashboard/edit-home" />
      <DashboardMenuItem icon={<Settings />} label="Enable Local Search" to="/dashboard/local-search" />
      <DashboardMenuItem icon={<Truck />} label="Change Delivery Charges" to="/dashboard/charges" />
      <DashboardMenuItem icon={<Phone />} label="Edit Contact Info" to="/dashboard/edit-contact" />
    </div>
  );
};
