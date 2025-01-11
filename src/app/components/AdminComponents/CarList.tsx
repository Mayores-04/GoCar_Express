"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

interface Car {
  _id: string;
  name: string;
  brand: string;
  seats: number;
  picture: string;
  description: string;
}

const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [editedCar, setEditedCar] = useState<Partial<Car>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/cars");
      setCars(response.data.cars || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching cars:", err.message);
      setError("Failed to fetch cars. Please try again later.");
      setLoading(false);
    }
  };

  const handleEdit = (carId: string) => {
    setEditingCarId(carId);
    const car = cars.find((car) => car._id === carId);
    if (car) {
      setEditedCar({ ...car });
    }
  };

  const handleSave = async (carId: string) => {
    try {
      const updatedCar = { ...editedCar, _id: carId };
      const response = await axios.put(`/api/cars/${carId}`, updatedCar);

      if (response.data.success) {
        toast.success("Car updated successfully");
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === carId ? { ...car, ...editedCar } : car
          )
        );
        setEditingCarId(null);
        setEditedCar({});
      } else {
        toast.error("Error updating car");
      }
    } catch (err) {
      toast.error("Error occurred while saving");
      console.error(err);
    }
  };

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await axios.delete(`/api/cars?id=${carId}`);
      if (response.data.success) {
        toast.success("Car deleted successfully");
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      } else {
        toast.error("Error deleting car");
      }
    } catch (err) {
      toast.error("Error occurred while deleting");
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedCar((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div id="CarList" className="flex bg-gray-100 full p-8 ">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Brand</th>
              <th className="border border-gray-300 px-4 py-2">Seats</th>
              <th className="border border-gray-300 px-4 py-2">Picture</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {editingCarId === car._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editedCar.name || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-2 py-1 rounded-lg"
                    />
                  ) : (
                    car.name
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingCarId === car._id ? (
                    <input
                      type="text"
                      name="brand"
                      value={editedCar.brand || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-2 py-1 rounded-lg"
                    />
                  ) : (
                    car.brand
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingCarId === car._id ? (
                    <input
                      type="number"
                      name="seats"
                      value={editedCar.seats || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-2 py-1 rounded-lg"
                    />
                  ) : (
                    car.seats
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Image
                    src={car.picture}
                    alt={car.name}
                    width={100}
                    height={70}
                    className="object-cover"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {editingCarId === car._id ? (
                    <textarea
                      name="description"
                      value={editedCar.description || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-2 py-1 rounded-lg"
                    />
                  ) : (
                    car.description
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-4 gap-4">
                  {editingCarId === car._id ? (
                    <>
                      <button
                        onClick={() => handleSave(car._id)}
                        className="bg-green-500 text-white px-4 my-4 py-2 w-full rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingCarId(null);
                          setEditedCar({});
                        }}
                        className="bg-gray-500 text-white px-4  my-4 py-2 w-full   rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(car._id)}
                        className="bg-yellow-500 text-white px-4  my-4 py-2  w-full rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="bg-red-500 text-white px-4 py-1  w-full rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarListPage;
