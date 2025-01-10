"use client"

import React, { useState } from "react";

const AddNewspage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    seats: "",
    picture: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Car added successfully!");
      setFormData({ name: "", brand: "", seats: "", picture: "", description: "" });
    } else {
      setMessage(`Error: ${data.error || "Failed to add car"}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add News Update</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium mb-1">news Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter car name"
            required
          />
        </div>
        <div>
          <label htmlFor="picture" className="block font-medium mb-1">Picture URL</label>
          <input
            type="text"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter picture URL"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter car description"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add News
        </button>
      </form>
      {message && (
        <div className={`mt-4 text-center ${message.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AddNewspage;
