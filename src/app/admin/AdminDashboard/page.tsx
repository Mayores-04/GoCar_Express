"use client";

import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { reservationData } from "@/app/data/reservationData";
import { CarPricing, AvailableCars, AllCars } from "@/app/data/pricing";

const AdminHome: React.FC = () => {
  const totalReserved = reservationData.length;

  const totalCarsAvailable = Object.values(AvailableCars).reduce(
    (sum, count) => sum + count,
    0
  );

  const TotalCarsRented = Object.keys(AllCars).reduce((acc, car) => {
    acc[car] = AllCars[car] - AvailableCars[car];
    return acc;
  }, {} as { [key: string]: number });

  // Total cars rented as the sum of rented cars for all car types
  const totalCarsRented = Object.values(TotalCarsRented).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalRevenue = reservationData.reduce((sum, reservation) => {
    const carPricePerDay = CarPricing[reservation.car] || 0;
    const rentalAmount = carPricePerDay * reservation.rentalDuration;
    return sum + rentalAmount;
  }, 0);

  const formattedRevenue = new Intl.NumberFormat().format(totalRevenue) + ".00";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-col items-center justify-between py-3 mb-6 bg-white rounded-lg shadow-md px-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
            Settings
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Total Reservations */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Reservations
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalReserved}</p>
          </div>

          {/* Total Cars Available */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Cars Available
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalCarsAvailable}
            </p>
          </div>

          {/* Total Cars Rented */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Cars Rented
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {totalCarsRented}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ₱{formattedRevenue}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Activity
          </h3>
          <div className="divide-y divide-gray-200">
            {/* Activity Item 1 */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">
                Manager Jake add news update
              </span>
              <span className="text-gray-400 text-sm">6 hours ago</span>
            </div>

            {/* Activity Item 2 */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">
                Manager Jake add reservation list page
              </span>
              <span className="text-gray-400 text-sm">3 hours ago</span>
            </div>

            {/* Activity Item 3 */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">
                Manager Jake update the Admin Dashboard
              </span>
              <span className="text-gray-400 text-sm">1 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
