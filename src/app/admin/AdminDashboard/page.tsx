"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDashboard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from "react-toastify";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for App Directory

interface Totals {
  totalCars: number;
  carsNotAvailable: number;
  totalCarsAvailable: number;
  totalCarsOnService: number;
  totalCarsRented: number;
  revenue: number;
  cars: any[]; // Assuming the car data will be stored here
}

const AdminHome: React.FC = () => {
  const [totals, setTotals] = useState<Totals>({
    totalCars: 0,
    carsNotAvailable: 0,
    totalCarsAvailable: 0,
    totalCarsOnService: 0,
    totalCarsRented: 0,
    revenue: 0,
    cars: [], // Store car data here
  });
  const [rentals, setRentals] = useState<any[]>([]);  
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false); // Track if we're on the client

  // Ensure we're on the client side before using useRouter
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Set to true once client-side rendering is initialized
  }, []);

  const fetchTotals = async () => {
    try {
      const response = await axios.get("/api/cars");
      if (response.data.success) {
        setTotals({
          totalCars: response.data.totalCars,
          carsNotAvailable: response.data.carsNotAvailable,
          totalCarsAvailable: response.data.totalCarsAvailable,
          totalCarsOnService: response.data.totalCarsOnService,
          totalCarsRented: response.data.totalCarsRented,
          revenue: response.data.revenue,
          cars: response.data.cars,  // Add cars data here
        });
      } else {
        toast.error("Failed to fetch totals. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to fetch totals. Please try again.");
    }
  };

  const fetchRentals = async () => {
    try {
      const response = await axios.get("/api/rentals");  
      if (response.data.success) {
        setRentals(response.data.rentals);

        const totalRevenue = response.data.rentals.reduce(
          (acc: number, rental: any) => acc + rental.totalAmount, 0
        );
        const totalCarsRented = response.data.rentals.length;

        setTotals((prev) => ({
          ...prev,
          revenue: totalRevenue,
          totalCarsRented: totalCarsRented,
        }));
      } else {
        toast.error("Failed to fetch rentals. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to fetch rentals. Please try again.");
    }
  };

  // Only fetch data on client-side to avoid SSR issues
  useEffect(() => {
    if (isClient) {
      fetchTotals();
      fetchRentals();
    }
  }, [isClient]);

  const token = process.env.NEXT_PUBLIC_SECRET_KEY;

  // Map rental dates for highlighting
  const rentalDates = rentals.map((rental) => ({
    rentalDate: new Date(rental.rentalDate),
    returnDate: new Date(rental.returnDate),
  }));

  // Highlight rental dates on the calendar
  const highlightRentalDates = ({ date }: { date: Date }) => {
    return rentalDates.some(
      ({ rentalDate, returnDate }) =>
        rentalDate.toDateString() === date.toDateString()
    )
      ? "highlighted-date"
      : "";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-col items-center justify-between py-3 mb-6 bg-white rounded-lg shadow-md px-8">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

          <Link
            href={`/admin/DashboardManagement?token=${token}`}
            className="flex items-center gap-5 px-4 py-2 rounded hover:text-slate-700 hover:underline"
          >
            <FontAwesomeIcon icon={faDashboard} className="text-xl" />
            <span className="opacity-100 whitespace-nowrap transition-opacity duration-300 ease-in-out">
              Dashboard Management
            </span>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Total Cars */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Cars</h3>
            <p className="text-3xl font-bold text-blue-600">{totals.totalCars}</p>
          </div>

          {/* Cars Available */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Cars Available</h3>
            <p className="text-3xl font-bold text-blue-600">{totals.totalCarsAvailable}</p>
          </div>

          {/* Cars Not Available */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Cars Not Available</h3>
            <p className="text-3xl font-bold text-blue-600">{totals.carsNotAvailable}</p>
          </div>

          {/* Cars On Service */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Cars on Service</h3>
            <p className="text-3xl font-bold text-blue-600">{totals.totalCarsOnService}</p>
          </div>

          {/* Total Cars Rented */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Cars Rented</h3>
            <p className="text-3xl font-bold text-yellow-600">{totals.totalCarsRented}</p>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ₱{totals.revenue}
            </p>
          </div>
        </div>

        {/* Rental Calendar */}
        <div className="mt-8 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-4">Rental Calendar</h2>
          <Calendar
            tileClassName={highlightRentalDates}
            className="custom-calendar"
          />
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h3>
          <div className="divide-y divide-gray-200">
            {/* Activity Items */}
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">Manager Jake added a news update</span>
              <span className="text-gray-400 text-sm">6 hours ago</span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">Manager Jake added reservation list page</span>
              <span className="text-gray-400 text-sm">3 hours ago</span>
            </div>
            <div className="py-4 flex justify-between">
              <span className="text-gray-600">Manager Jake updated the Admin Dashboard</span>
              <span className="text-gray-400 text-sm">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
