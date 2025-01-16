"use client";

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

const AdminHome: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        
        {/* Header */}
        <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-col items-center justify-between py-3 mb-6 bg-white rounded-lg shadow-md px-8">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Settings
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">1,245</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-green-600">3,532</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">$24,892</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <div className="divide-y divide-gray-200">
            {/* Activity Item 1 */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">User John Doe placed an order</span>
              <span className="text-gray-400 text-sm">2 hours ago</span>
            </div>

            {/* Activity Item 2 */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">New product added: iPhone 14</span>
              <span className="text-gray-400 text-sm">5 hours ago</span>
            </div>

            {/* Activity Item 3 */}
            <div className="py-4 flex justify-between">
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
