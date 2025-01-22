"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import useActivities from "@/lib/hooks/useActivities";

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

const CarListPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [editedCar, setEditedCar] = useState<Partial<Car>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/cars");
      setCars(response.data.cars || []);

       // Fetch Recent Activities
       const activitiesResponse = await axios.get("/api/activities");
       if (activitiesResponse.data.success) {
         fetchActivities(); // Fetch activities using the hook
       } else {
         toast.error("Failed to fetch activities data.");
       }

      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching cars:", err.message);
      setError("Failed to fetch cars. Please try again later.");
      setLoading(false);
    }
  };

  
  const { activities, addActivity, fetchActivities } = useActivities();
  
  const handleEdit = (carId: string) => {
    setEditingCarId(carId);
    const car = cars.find((car) => car._id === carId);
    if (car) {
      setEditedCar({ ...car,
        carstatus: car.carstatus || "Available",
       });
    }
  };

  
  const handleSave = async (carId: string) => {
    if (
      !editedCar.carstatus ||
      !editedCar.name ||
      !editedCar.brand ||
      !editedCar.seats ||
      !editedCar.description
    ) {
      toast.error("All fields are required to save the car details.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("carstatus", editedCar.carstatus);
      formData.append("name", editedCar.name);
      formData.append("brand", editedCar.brand);
      formData.append("seats", String(editedCar.seats));
      formData.append("price", String(editedCar.price));
      formData.append("description", editedCar.description);

      if (imageFile) {
        formData.append("picture", imageFile);
      }

      const response = await axios.put(`/api/cars?id=${carId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Car updated successfully");
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === carId
              ? {
                  ...car,
                  ...editedCar,
                  picture: response.data.car.picture || car.picture,
                }
              : car
          )
        );
        setEditingCarId(null);
        setEditedCar({});
        setImageFile(null);
        addActivity("Edit Car");
      } else {
        toast.error(response.data.msg || "Failed to update car.");
      }
    } catch (error) {
      console.error("Error updating car:", error);
      toast.error("An error occurred while saving. Please try again.");
    }
  };

  const handleDelete = async (carId: string) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      const response = await axios.delete(`/api/cars?id=${carId}`);
      if (response.data.success) {
        toast.success("Car deleted successfully");
        addActivity("Delete Car");
        setCars((prevCars) => prevCars.filter((car) => car._id !== carId));
      } else {
        toast.error("Error deleting car");
      }
    } catch (err) {
      toast.error("Error occurred while deleting");
      console.error(err);
    }
  };

  // const handleInputChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setEditedCar((prev) => ({ ...prev, [name]: value }));
  // };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setEditedCar((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.imageUrl) {
        setEditedCar((prev) => ({
          ...prev,
          picture: response.data.imageUrl,
        }));
      }
    } catch (err) {
      console.error(err);
    }
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
    <div id="CarList" className="flex bg-gray-100 p-8">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Status</th>
              {/* <th className="border border-gray-300 px-4 py-2">CarId</th> */}
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Brand</th>
              <th className="border border-gray-300 px-4 py-2">Seats</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
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
                     <select
                      id="carstatus"
                      name="carstatus"
                      value={editedCar.carstatus}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                      <option value="On Service">On Service</option>
                    </select>
                  ) : (
                    car.carstatus
                  )}
                </td>
                {/* <td className="border border-gray-300 px-4 py-2">
                    <h1 className="w-full border border-gray-300 px-2 py-1 rounded-lg">
                      {car._id}
                    </h1>
                </td> */}
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
                  {editingCarId === car._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editedCar.price || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-2 py-1 rounded-lg"
                    />
                  ) : (
                    car.price
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Image
                    src={editedCar.picture || car.picture}
                    alt={car.name}
                    width={100}
                    height={70}
                    className="object-cover"
                  />
                  {editingCarId === car._id && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files) {
                          setImageFile(e.target.files[0]);
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                      className="mt-2"
                    />
                  )}
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
                          setImageFile(null);
                        }}
                        className="bg-gray-500 text-white px-4 my-4 py-2 w-full rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(car._id)}
                        className="bg-yellow-500 text-white px-4 my-4 py-2 w-full rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(car._id)}
                        className="bg-red-500 text-white px-4 py-1 w-full rounded hover:bg-red-600"
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
