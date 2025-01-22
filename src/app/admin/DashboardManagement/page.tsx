"use client";

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { AxiosError } from "axios";
import useActivities from "@/lib/hooks/useActivities";
import { toast } from "react-toastify";

interface Totals {
  revenue: number;
  totalCarsRented: number;
}

interface Rental {
  _id: string;
  carId: string;
  carName: string;
  userId: string;
  userName: string;
  rentalDate: string;
  returnDate: string;
}

interface Car {
  _id: string;
  carstatus: string;
  name: string;
  brand: string;
  seats: number;
  price: number;
  picture: string;
  description: string;
}

const AdminDashboardManagement = () => {
  const [totals, setTotals] = useState<Totals>({
    revenue: 0,
    totalCarsRented: 0,
  });
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { activities, addActivity, fetchActivities } = useActivities();

  const [newRental, setNewRental] = useState<Rental>({
    _id: "",
    carId: "",
    carName: "",
    userId: "",
    userName: "",
    rentalDate: "",
    returnDate: "",
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetching total dashboard data
      const totalsResponse = await axios.get("/api/dashboard");
      const { revenue, totalCarsRented } = totalsResponse.data.dashboard;
      setTotals({ revenue, totalCarsRented });

      // Fetching rentals data (raw carId and userId)
      const rentalsResponse = await axios.get("/api/rentals");
      setRentals(rentalsResponse.data.rentals);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const rentalDates = rentals.map((rental) => ({
    rentalDate: new Date(rental.rentalDate),
    returnDate: new Date(rental.returnDate),
  }));

  const highlightRentalDates = ({ date }: { date: Date }) => {
    return rentalDates.some(
      ({ rentalDate, returnDate }) =>
        rentalDate.toDateString() === date.toDateString()
      // || returnDate.toDateString() === date.toDateString()
    )
      ? "highlighted-date"
      : "";
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewRental((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRental = async () => {
    try {
      if (
        !newRental.carId ||
        !newRental.userId ||
        !newRental.rentalDate ||
        !newRental.returnDate
      ) {
        setError("Please fill in all fields.");
        return;
      }

      const rentalDate = new Date(newRental.rentalDate).toISOString();
      const returnDate = new Date(newRental.returnDate).toISOString();

      // Fetch the selected car's price
      const selectedCar = cars.find((car) => car._id === newRental.carId);
      const totalAmount = selectedCar ? selectedCar.price : 0;

      const response = await axios.post("/api/rentals", {
        carId: newRental.carId,
        userId: String(newRental.userId),
        rentalDate,
        returnDate,
        totalAmount,
      });

      if (response.data.success) {
        toast.success("Added rentals successfully");
        addActivity("Added info in rentals");
        setNewRental({
          _id: "",
          carId: "",
          carName: "",
          userId: "",
          userName: "",
          rentalDate: "",
          returnDate: "",
        });
        fetchDashboardData();
        setError(null);
      } else {
        setError("Failed to add rental.");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Axios Error: ", err.response?.data);
        setError("Failed to add rental.");
      } else {
        console.error("Error adding rental:", err);
        setError("Error adding rental.");
      }
    }
  };

  const handleDeleteRental = async (rentalId: string) => {
    try {
      const response = await axios.delete(`/api/rentals?id=${rentalId}`);
      if (response.data.success) {
        toast.success("Rentals deleted successfully");
        addActivity("Delete info in rentals")
        fetchDashboardData();
      } else {
        setError("Failed to delete rental. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting rental:", err);
      setError("Failed to delete rental. Please try again.");
    }
  };

  const [cars, setCars] = useState<Car[]>([]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/cars");
      setCars(response.data.cars || []);

      setLoading(false);
    } catch (err: any) {
      toast.error("Failed to fetch cars. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCars();
  }, []);

  // Filter rentals for current and past
  const currentRentals = rentals.filter((rental) => {
    const returnDate = new Date(rental.returnDate);
    return returnDate >= new Date(); // Rentals with return dates in the future
  });

  const pastRentals = rentals.filter((rental) => {
    const returnDate = new Date(rental.returnDate);
    return returnDate < new Date(); // Rentals that have already ended
  });

  const [view, setView] = useState<"current" | "past">("current");

  const handleViewToggle = (viewType: "current" | "past") => {
    setView(viewType);
  };

  const rentalsToDisplay = view === "current" ? currentRentals : pastRentals;

  return (
    <div className="p-6">
      {loading && (
        <div>
          <div className="flex items-center justify-center h-screen">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className=" bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Add New Rental</h2>
            <div className="flex flex-col gap-4">
              <div className="border border-gray-300 px-4 py-2">
                <select
                  name="carId"
                  value={newRental.carId}
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                >
                  <option value="">Select Car</option>
                  {cars
                    .filter((car) => car.carstatus !== "On Service")
                    .map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.name} ({car.brand}) - ₱{car.price}
                      </option>
                    ))}
                </select>
              </div>

              <input
                type="text"
                name="userId"
                placeholder="User Name"
                value={newRental.userId}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
              <input
                type="date"
                name="rentalDate"
                value={newRental.rentalDate}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
              <input
                type="date"
                name="returnDate"
                value={newRental.returnDate}
                onChange={handleInputChange}
                className="p-2 border rounded"
              />
              <button
                onClick={handleAddRental}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Rental
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Existing Rentals</h2>

            {/* View toggle buttons */}
            <div className="mb-4">
              <button
                onClick={() => handleViewToggle("current")}
                className={`p-2 ${view === "current" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded`}
              >
                Current Rentals
              </button>
              <button
                onClick={() => handleViewToggle("past")}
                className={`p-2 ml-4 ${view === "past" ? "bg-blue-500 text-white" : "bg-gray-200"} rounded`}
              >
                Past Rentals
              </button>
            </div>

            <ul className="space-y-4">
              {rentalsToDisplay.map((rental) => {
                // Find the car name by carId
                const car = cars.find((car) => car._id === rental.carId);
                return (
                  <li
                    key={rental._id}
                    className="flex justify-between items-center"
                  >
                    <span>{`Car: ${car ? car.name : "Unknown"}, User: ${rental.userId}, Rental Date: ${new Date(
                      rental.rentalDate
                    ).toLocaleDateString()}`}</span>
                    <button
                      onClick={() => handleDeleteRental(rental._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardManagement;
