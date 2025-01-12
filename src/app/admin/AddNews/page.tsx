"use client";

import React, { useState } from "react";

const AddNewsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    customerName: "",
    description: "",
    date: "",
    location: "",
    duration: "",
    contact: "",
    picture: "",
  });

  const [galleryItems, setGalleryItems] = useState<
    { title: string; date: string; picture: string }[]
  >([]);

  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle gallery input changes
  const handleGalleryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setGalleryItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [name]: value } : item
      )
    );
  };

  // Add a new gallery item
  const addGalleryItem = () => {
    setGalleryItems((prev) => [...prev, { title: "", date: "", picture: "" }]);
  };

  // Remove a gallery item
  const removeGalleryItem = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      gallery: galleryItems,
    };

    const response = await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("News added successfully!");
      setFormData({
        title: "",
        customerName: "",
        description: "",
        date: "",
        location: "",
        duration: "",
        contact: "",
        picture: "",
      });
      setGalleryItems([]);
    } else {
      setMessage(`Error: ${data.error || "Failed to add news"}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Add News Update</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter news title"
            required
          />
        </div>
        <div>
          <label htmlFor="customerName" className="block font-medium mb-1">
            Customer Name
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter customer name"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter news description"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block font-medium mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter location"
          />
        </div>
        <div>
          <label htmlFor="duration" className="block font-medium mb-1">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter duration"
          />
        </div>
        <div>
          <label htmlFor="contact" className="block font-medium mb-1">
            Contact
          </label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            placeholder="Enter contact information"
          />
        </div>
        <div>
          <label htmlFor="picture" className="block font-medium mb-1">
            Picture URL
          </label>
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
          <h2 className="text-lg font-medium mb-2">Gallery</h2>
          {galleryItems.map((item, index) => (
            <div key={index} className="mb-4 space-y-2">
              <input
                type="text"
                name="title"
                placeholder="Gallery title"
                value={item.title}
                onChange={(e) => handleGalleryChange(index, e)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="date"
                name="date"
                value={item.date}
                onChange={(e) => handleGalleryChange(index, e)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <input
                type="text"
                name="picture"
                placeholder="Picture URL"
                value={item.picture}
                onChange={(e) => handleGalleryChange(index, e)}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
              <button
                type="button"
                onClick={() => removeGalleryItem(index)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addGalleryItem}
            className="bg-green-600 text-white rounded px-4 py-2"
          >
            Add Gallery Item
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Add News
        </button>
      </form>
      {message && (
        <div
          className={`mt-4 text-center ${
            message.startsWith("Error") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddNewsPage;
