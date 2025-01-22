"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import useActivities from "@/lib/hooks/useActivities";
import axios from "axios";

interface FormData {
  title: string;
  customerName: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  contact: string;
}

interface NewsItem {
  _id: string;
  title: string;
  customerName: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  contact: string;
  main_picture: string;
  gallery: {
    title: string;
    date: string;
    gallery_picture: string;
  }[];
}

interface GalleryItem {
  title: string;
  date: string;
  picture: File | null;
}

const AddNewsPage: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    customerName: "",
    description: "",
    date: "",
    location: "",
    duration: "",
    contact: "",
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const { activities, addActivity, fetchActivities } = useActivities();
  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news");
      const data = await response.json();
      if (data.success) {
        setNewsList(data.news);
      } else {
        toast.error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Error fetching news");
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchNews();
  }, []);

  const handleEdit = (news: NewsItem) => {
    setFormData({
      title: news.title,
      customerName: news.customerName,
      description: news.description,
      date: news.date,
      location: news.location,
      duration: news.duration,
      contact: news.contact,
    });
    setImage(null);
    setGalleryItems(
      news.gallery.map((item) => ({
        title: item.title,
        date: item.date,
        picture: null,
      }))
    );
    setEditId(news._id);
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      customerName: "",
      description: "",
      date: "",
      location: "",
      duration: "",
      contact: "",
    });
    setImage(null);
    setGalleryItems([]);
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news item?")) return;

    try {
      const response = await fetch(`/api/news?id=${id}`, { method: "DELETE" });
      const data = await response.json();
      if (response.ok) {
        toast.success("News deleted successfully!");
        addActivity("Delete news");
        fetchNews();
      } else {
        toast.error(data.msg || "Failed to delete news");
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      toast.error("Error deleting news");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleGalleryImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    setGalleryItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, picture: file } : item
      )
    );
  };

  const addGalleryItem = () => {
    setGalleryItems((prev) => [
      ...prev,
      { title: "", date: "", picture: null },
    ]);
  };

  const removeGalleryItem = (index: number) => {
    setGalleryItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("customerName", formData.customerName);
    formPayload.append("description", formData.description);
    formPayload.append("date", formData.date);
    formPayload.append("location", formData.location);
    formPayload.append("duration", formData.duration);
    formPayload.append("contact", formData.contact);

    if (image) {
      formPayload.append("main_picture", image);
    }

    galleryItems.forEach((item, index) => {
      if (item.title && item.date && item.picture) {
        formPayload.append(`gallery[${index}][title]`, item.title);
        formPayload.append(`gallery[${index}][date]`, item.date);
        formPayload.append(`gallery[${index}][gallery_picture]`, item.picture);
      }
    });

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        body: formPayload,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("News added successfully!");
        addActivity("Added news")
        setFormData({
          title: "",
          customerName: "",
          description: "",
          date: "",
          location: "",
          duration: "",
          contact: "",
        });
        setImage(null);
        setGalleryItems([]);
      } else {
        toast.error(`Error: ${data.msg || "Failed to add news"}`);
      }
    } catch (error) {
      toast.error("Error submitting form.");
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <div className=" m-6 mt-20 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">
          {editId ? "Edit News Update" : "Add News Update"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Form Fields */}
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

          {/* Upload Picture */}
          <div>
            <label htmlFor="image" className="block font-medium mb-2">
              Upload Main Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-24  bg-gray-200 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                {image ? (
                  <Image
                    width={128}
                    height={96}
                    src={URL.createObjectURL(image)}
                    alt="Uploaded Preview"
                    className="object-cover "
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Choose File
              </button>
            </div>
          </div>
          {/* Gallery Section */}
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
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={item.date}
                  onChange={(e) => handleGalleryChange(index, e)}
                  className="w-full border border-gray-300 rounded px-4 py-2"
                  required
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleGalleryImageChange(index, e)}
                  required
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Add Gallery Item
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update News" : "Submit"}
          </button>
        </form>
      </div>
      {/* News List */}
      <div className="mb-4 mt-10 p-4 m-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">News List</h2>
        {newsList.map((news) => (
          <div
            key={news._id}
            className="border border-gray-300 rounded-lg p-4 mb-4 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{news.title}</h3>
              <p className="text-sm text-gray-600">{news.description}</p>
            </div>
            <div className="flex space-x-4">
              {editId === news._id ? (
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(news)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(news._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddNewsPage;
