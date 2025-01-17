"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

interface Car {
  _id: string;
  carstatus: string;
  name: string;
  brand: string;
  seats: number;
  picture: string;
  description: string;
  price: number;
}

const AddCarPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [data, setData] = useState<{
    carstatus: string;
    name: string;
    brand: string;
    seats: string;
    description: string;
    price: string;
  }>({
    carstatus: "Available",
    name: "",
    brand: "",
    seats: "",
    description: "",
    price: "",
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image && !editingCar) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("carstatus", data.carstatus);
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("seats", data.seats);
    formData.append("price", data.price);
    formData.append("description", data.description);
    if (image) formData.append("picture", image);

    try {
      setLoading(true);
      let response;
      if (editingCar) {
        response = await axios.put(`/api/cars?id=${editingCar._id}`, formData);
        if (response.data.success) {
          toast.success("Car updated successfully");
          setEditingCar(null);
        } else {
          toast.error("Error updating car");
        }
      } else {
        response = await axios.post("/api/cars", formData);
        if (response.data.success) {
          toast.success("Car added successfully");
        } else {
          toast.error("Error adding car");
        }
      }

      setImage(null);
      setData({
        carstatus: "Available",
        name: "",
        brand: "",
        seats: "",
        description: "",
        price: "",
      });
      fetchCars();
    } catch (error) {
      toast.error("Error occurred while saving");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setData({
      carstatus: car.carstatus,
      name: car.name,
      brand: car.brand,
      seats: car.seats.toString(),
      description: car.description,
      price: car.price.toString(),
    });
    setImage(null);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingCar(null);
    setData({
      carstatus: "Available",
      name: "",
      brand: "",
      seats: "",
      description: "",
      price: "",
    });
    setImage(null);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div id="AddCarToList" className="flex bg-gray-100">
      <div className="w-full p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingCar ? "Edit Car" : "Add a New Car"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="carstatus" className="block font-medium mb-2">
                  Car Status
                </label>
                <select
                  id="carstatus"
                  name="carstatus"
                  value={data.carstatus} 
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                  <option value="On Service">On Service</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block font-medium mb-2">
                  Car Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter car name"
                  required
                />
              </div>

              <div>
                <label htmlFor="brand" className="block font-medium mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={data.brand}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter car brand"
                  required
                />
              </div>

              <div>
                <label htmlFor="seats" className="block font-medium mb-2">
                  Seats
                </label>
                <input
                  type="number"
                  id="seats"
                  name="seats"
                  value={data.seats}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number of seats"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block font-medium mb-2">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={data.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the price"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block font-medium mb-2">
                  Upload Picture
                </label>
                <div className="flex flex-col xl:flex-row lg:flex-row md:flex-row sm:flex-col justify-center items-center">
                  <div className="w-32 h-24 bg-gray-200 border mx-4 border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                    {image ? (
                      <Image
                        width={140}
                        height={100}
                        src={URL.createObjectURL(image)}
                        alt="Uploaded Preview"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById("image")?.click()}
                    className="bg-blue-600 my-4 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={data.description}
                onChange={handleChange}
                className="w-full border border-gray-300 min-h-16 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter car description"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingCar ? "Update Car" : "Add Car"}
            </button>
            {editingCar && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full mt-4 bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            )}
          </form>
        </div>
        {/* Cars List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Cars List</h2>
          <ul>
            {cars.map((car) => (
              <li
                key={car._id}
                className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{car.name}</h3>
                    <p>{car.brand}</p>
                  </div>
                  <div>
                    {editingCar?._id === car._id ? (
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(car)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;
