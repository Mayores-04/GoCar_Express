"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import CarList from "@/app/components/AdminComponents/CarList";

interface Car {
  _id: string;
  name: string;
  brand: string;
  seats: number;
  picture: string;
  description: string;
}

const AddCarPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [data, setData] = useState<{
    name: string;
    brand: string;
    seats: string;
    description: string;
  }>({
    name: "",
    brand: "",
    seats: "",
    description: "",
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
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
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("seats", data.seats);
    formData.append("description", data.description);
    if (image) formData.append("picture", image);

    try {
      if (editingCar) {
        const response = await axios.put(
          `/api/cars/${editingCar._id}`,
          formData
        );

        if (response.data.success) {
          toast.success("Car updated successfully");
          setEditingCar(null);
        } else {
          toast.error("Error updating car");
        }
      } else {
        const response = await axios.post("/api/cars", formData);

        if (response.data.success) {
          toast.success("Car added successfully");
        } else {
          toast.error("Error adding car");
        }
      }

      setImage(null);
      setData({ name: "", brand: "", seats: "", description: "" });
      fetchCars();
    } catch (error) {
      toast.error("Error occurred while saving");
      console.error(error);
    }
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
    <div id="AddCarToList" className="flex bg-gray-100">
      <div className="w-full p-8">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingCar ? "Edit Car" : "Add a New Car"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
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
                <label htmlFor="image" className="block font-medium mb-2">
                  Upload Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-24 bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
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
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter car description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingCar ? "Update Car" : "Add Car"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCarPage;
