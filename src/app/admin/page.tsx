"use client";

import React from 'react';
import Sidebar from '../components/AdminComponents/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminHome: React.FC = () => {
  return (
    <div className="flex">
      {/* Main content area */}
      <div className="flex-1 p-8 bg-gray-100">
        <ToastContainer theme="dark" />

        {/* Header */}
        <div className="flex items-center justify-between py-4 border-b border-gray-300">
          <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
          <button className="bg-blue-600 text-white py-2 px-4 rounded">Settings</button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,245</p>
          </div>

          {/* Card 2: Total Orders */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">3,532</p>
          </div>

          {/* Card 3: Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">$24,892</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">User John Doe placed an order</span>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New product added: iPhone 14</span>
              <span className="text-gray-400 text-sm">5 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order #4567 shipped</span>
              <span className="text-gray-400 text-sm">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
