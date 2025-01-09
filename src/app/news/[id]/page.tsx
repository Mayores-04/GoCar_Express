"use client";

import React, { useState } from "react";
import { Metadata } from "next";

import { newsData } from "../../data/news";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

interface NewsPageProps {
  params: Promise<{ id: string }>; 
}

const NewsPerId: React.FC<NewsPageProps> = ({ params }) => {
  const [newsParams, setNewsParams] = React.useState<{ id: string } | null>(null);

  React.useEffect(() => {
    params.then((resolvedParams) => setNewsParams(resolvedParams));
  }, [params]);

  const news = newsParams
    ? newsData.find((item) => item.id.toString() === newsParams.id)
    : null;

  const [zoomedGallery, setZoomedGallery] = useState<{
    gallery: { picture: string }[];
    currentIndex: number;
  } | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!newsParams) {
    return (
      <div className="bg-[#263033] text-white min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="bg-[#263033] text-white min-h-screen flex items-center justify-center">
        <p>News not found</p>
      </div>
    );
  }

  const openGallery = (gallery: { picture: string }[], index: number) => {
    setZoomedGallery({ gallery, currentIndex: index });
  };

  const closeGallery = () => {
    setZoomedGallery(null);
    setShowShareOptions(false);
  };

  const goToNextImage = () => {
    if (zoomedGallery) {
      const nextIndex = (zoomedGallery.currentIndex + 1) % zoomedGallery.gallery.length;
      setZoomedGallery({ gallery: zoomedGallery.gallery, currentIndex: nextIndex });
    }
  };

  const goToPreviousImage = () => {
    if (zoomedGallery) {
      const prevIndex =
        (zoomedGallery.currentIndex - 1 + zoomedGallery.gallery.length) %
        zoomedGallery.gallery.length;
      setZoomedGallery({ gallery: zoomedGallery.gallery, currentIndex: prevIndex });
    }
  };

  return (
    <>
      <Header />

      <div className="bg-[#263033] text-white min-h-screen">
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
            <img
              src={news.picture}
              alt={news.title}
              className="w-full rounded-md mb-4"
            />
            <p className="text-gray-600 mb-4">{news.description}</p>
            <p className="text-gray-500">Date: {news.date}</p>
            <p className="text-gray-500">Location: {news.location}</p>
            <p className="text-gray-500">Duration: {news.duration}</p>
            <p className="text-gray-500">Contact: {news.contact}</p>

            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-4">
                {news.gallery?.map((item, index) => (
                  <img
                    key={index}
                    src={item.picture}
                    alt={item.title}
                    className="rounded-lg cursor-pointer"
                    onClick={() => openGallery(news.gallery, index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {zoomedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <button
            onClick={goToPreviousImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            aria-label="Previous Image"
          >
            &#8249;
          </button>
          <img
            src={zoomedGallery.gallery[zoomedGallery.currentIndex].picture}
            alt="Zoomed"
            className="max-w-full max-h-full"
          />
          <button
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl"
            aria-label="Next Image"
          >
            &#8250;
          </button>
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-2xl"
            aria-label="Close Gallery"
          >
            &#10005;
          </button>
        </div>
      )}

      <Footer />
    </>
  );
};

export default NewsPerId;
