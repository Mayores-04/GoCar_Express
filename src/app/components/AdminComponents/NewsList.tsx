"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface GalleryItem {
  title: string;
  date: string;
  gallery_picture: string;
}

interface NewsItem {
  _id: string;
  title: string;
  main_picture: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  contact: string;
  gallery: GalleryItem[];
  customerName: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/news");
        setNews(response.data.news);
      } catch (err: any) {
        console.error("Error fetching news:", err.message);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  
  
  if (loading) {
    return (
      <div>
        <div className="flex items-center h-screen justify-center">
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
    <>
      <div
        id="ContactPage"
        className="flex flex-col justify-center items-center bg-[#263033] text-white"
      >
        <section className="w-[95%] justify-center py-16 px-6 pt-24">
          <div className="max-w-full mx-auto w-full">
            <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
              <span className="text-[#4169e1]">GoCar Express</span> Group News
            </h1>

            <div className="flex flex-col gap-8">
              {news && Array.isArray(news) && news.length > 0 ? (
                news.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white justify-center items-center flex flex-col p-6 rounded-lg shadow-lg transform transition duration-300"
                  >
                    <div className="w-[95%] justify-center items-center">
                      <div className="flex justify-center items-center w-full my-6">
                        <img
                          src={item.main_picture}
                          alt={item.title}
                          className="w-full h-auto rounded-md shadow-md"
                        />
                      </div>
                      <h1 className="text-3xl xl:text-5xl lg:text-5xl md:text-3xl text-center font-extrabold text-gray-800 mb-4">
                        {item.title}
                      </h1>
                      <h2 className="text-xl xl:text-3xl lg:text-3xl md:text-2xl text-left font-semibold text-gray-800 mb-4">
                        {item.customerName} {item.title}
                      </h2>
                      <p className="text-gray-600 mb-4 ">{item.description}</p>
                      <p className="text-gray-500 mb-4 ">{item.date}</p>
                      <p className="text-gray-500 mb-4 ">{item.location}</p>
                      <p className="text-gray-500 mb-4 ">
                        Duration: {item.duration}
                      </p>
                      <p className="text-gray-500 mb-4 ">
                        Contact: {item.contact}
                      </p>
                    </div>
                    <div className="w-full xl:w-[95%] lg:w-[95%] md:w-[95%] py-8 bg-gray-100 rounded-lg">
                      <h3 className="text-2xl font-bold text-gray-800 text-left px-6 mb-6">
                        GALLERY: {item.title}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
                        {item.gallery &&
                        Array.isArray(item.gallery) &&
                        item.gallery.length > 0 ? (
                          item.gallery.map((galleryItem, galleryIndex) => (
                            <div
                              key={galleryIndex}
                              className="relative elements overflow-hidden rounded-lg shadow-md"
                            >
                              <img
                                src={galleryItem.gallery_picture}
                                alt={galleryItem.title}
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                draggable={false}
                              />
                            </div>
                          ))
                        ) : (
                          <p>No images available in this gallery.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No news available.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NewsList;
