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
import { useRouter } from "next/navigation";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

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
    cars: [],
  });
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState(false); // Track if we're on the client
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

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
          cars: response.data.cars,
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
          (acc: number, rental: any) => acc + rental.totalAmount,
          0
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

  useEffect(() => {
    if (isClient) {
      fetchTotals();
      fetchRentals();
    }
  }, [isClient]);

  const token = process.env.NEXT_PUBLIC_SECRET_KEY;

  // Filter rentals based on the selected month
  const rentalsForSelectedMonth = rentals.filter((rental) => {
    const rentalDate = new Date(rental.rentalDate);
    return (
      rentalDate.getMonth() === selectedMonth.getMonth() &&
      rentalDate.getFullYear() === selectedMonth.getFullYear()
    );
  });

  const handleMonthChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date;
  }) => {
    setSelectedMonth(activeStartDate);
  };

  const highlightRentalDates = ({ date }: { date: Date }) => {
    const rentalDates = rentals.map((rental) => new Date(rental.rentalDate));
    return rentalDates.some(
      (rentalDate) => rentalDate.toDateString() === date.toDateString()
    )
      ? "highlighted-date"
      : "";
  };

  const pieChartData = {
    labels: [
      "Total Cars",
      "Cars Available",
      "Cars On Service",
      "Cars Not Available",
    ],
    datasets: [
      {
        data: [
          totals.totalCars,
          totals.totalCarsAvailable,
          totals.totalCarsOnService,
          totals.carsNotAvailable,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Disable all dates for selection
  const tileDisabled = ({ date }: { date: Date }) => {
    return true; // Disable all dates
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-col items-center justify-between py-3 mb-6 bg-white rounded-lg shadow-md px-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Dashboard
          </h1>
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Cars</h3>
            <p className="text-3xl font-bold text-blue-600">
              {totals.totalCars}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Cars Available
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {totals.totalCarsAvailable}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Cars Not Available
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {totals.carsNotAvailable}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Cars on Service
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {totals.totalCarsOnService}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Cars Rented
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {totals.totalCarsRented}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">
              ₱{totals.revenue}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-16 mt-8">
          <div className="bg-white max-w-[400px] p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Car Statistics
            </h3>
            {isClient && <Pie data={pieChartData} options={pieChartOptions} />}
          </div>
          <div className="w-full bg-white flex-row flex">
            <div className=" bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">Rental Calendar</h2>
              {isClient && (
                <Calendar
                  value={selectedMonth}
                  onActiveStartDateChange={({ activeStartDate }) =>
                    handleMonthChange({ activeStartDate })
                  }
                  tileClassName={highlightRentalDates}
                  className="custom-calendar"
                />
              )}
            </div>

            <div className="w-full bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">
                Rentals for{" "}
                {selectedMonth.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>

              <ul className="space-y-4">
                {rentalsForSelectedMonth.map((rental) => {
                  const car = totals.cars.find(
                    (car) => car._id === rental.carId
                  );
                  return (
                    <li
                      key={rental._id}
                      className="flex justify-between items-center"
                    >
                      <span>{`Car: ${car ? car.name : "Unknown"}, User: ${
                        rental.userId
                      }, Rental Date: ${new Date(
                        rental.rentalDate
                      ).toLocaleDateString()}`}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
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
