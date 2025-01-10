"use client";

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error("Image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("seats", data.seats);
    formData.append("description", data.description);
    formData.append("picture", image);

    try {
      const response = await axios.post("/api/cars", formData);

      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(null);
        setData({ name: "", brand: "", seats: "", description: "" });
      } else {
        toast.error("Error while adding car");
      }
    } catch (error) {
      toast.error("Error occurred while uploading");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 my-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Car Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Car Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter car name"
            required
          />
        </div>

        {/* Car Brand */}
        <div>
          <label htmlFor="brand" className="block font-medium mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={data.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter car brand"
            required
          />
        </div>

        {/* Number of Seats */}
        <div>
          <label htmlFor="seats" className="block font-medium mb-1">
            Seats
          </label>
          <input
            type="number"
            id="seats"
            name="seats"
            value={data.seats}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter number of seats"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block font-medium mb-1">
            Upload Picture
          </label>
          <div className="mt-4">
            <Image
              width={140}
              height={100}
              src={image ? URL.createObjectURL(image) : "/images/mg_car.jpg"}
              alt="Uploaded Preview"
              style={{ width: "auto", height: "100%" }}
            />
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
            className="border border-gray-300 rounded px-4 py-2"
          />
          <button
            type="button"
            onClick={() => document.getElementById("image")?.click()}
            className="mt-2 bg-gray-300 rounded px-4 py-2"
          >
            Choose File
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 min-h-[300px]"
            placeholder="Enter car description"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCarPage;
