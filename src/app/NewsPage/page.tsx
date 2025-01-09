"use client";

import React, { useEffect, useState } from "react";
import {
  FaShareAlt,
  FaFacebook,
  FaEnvelope,
  FaFacebookMessenger,
  FaSave,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { newsData } from "../data/news";

type GalleryItem = {
  title: string;
  picture: string;
  date: string;
};

const NewsPage: React.FC = () => {
  const [zoomedGallery, setZoomedGallery] = useState<{
    gallery: GalleryItem[];
    currentIndex: number;
  } | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const openGallery = (gallery: GalleryItem[], index: number) => {
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

  const openEmailClient = (imageUrl: string) => {
    const subject = "Check out this amazing image!";
    const body = `I wanted to share this image with you: ${imageUrl}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleShare = (type: string, imageUrl: string) => {
    if (type === "facebook") {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        imageUrl
      )}`;
      window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
    } else if (type === "messenger") {
      const messengerShareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
        imageUrl
      )}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(
        window.location.href
      )}`;
      window.open(messengerShareUrl, "_blank", "noopener,noreferrer");
    } else if (type === "email") {
      openEmailClient(imageUrl);
    } else if (type === "save") {
      saveImage(imageUrl);
    }
  };

  const saveImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error(`Failed to fetch the image. Status: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = imageUrl.split("/").pop() || "downloaded_image";
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(objectUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error saving the image:", error);
      alert("Failed to save the image. Please try again.");
    }
  };

  return (
    <>
      <header>
        <Header />
      </header>

      <div id="ContactPage" className="flex flex-col justify-center items-center bg-[#263033] text-white">
        <section className="w-[95%] justify-center py-16 px-6 pt-24">
          <div className="max-w-full mx-auto w-full">
            <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
              <span className="text-[#4169e1]">GoCar Express</span> Group News
            </h1>

            <div className="flex flex-col gap-8">
              {newsData && Array.isArray(newsData) && newsData.length > 0 ? (
                newsData.map((news, index) => (
                  <div key={index} className="bg-white justify-center items-center flex flex-col p-6 rounded-lg shadow-lg transform transition duration-300">
                    <div className="w-[95%] justify-center items-center">
                      <div className="flex justify-center items-center w-full my-6">
                        <img src={news.picture} alt={news.title} className="w-full h-auto rounded-md shadow-md" />
                      </div>
                      <h1 className="text-3xl xl:text-5xl lg:text-5xl md:text-3xl text-center font-extrabold text-gray-800 mb-4">
                        {news.title}
                      </h1>
                      <h2 className="text-xl xl:text-3xl lg:text-3xl md:text-2xl text-left font-semibold text-gray-800 mb-4">
                        {news.customerName} {news.title}
                      </h2>
                      <p className="text-gray-600 mb-4 ">{news.description}</p>
                      <p className="text-gray-500 mb-4 ">{news.date}</p>
                      <p className="text-gray-500 mb-4 ">{news.location}</p>
                      <p className="text-gray-500 mb-4 ">Duration: {news.duration}</p>
                      <p className="text-gray-500 mb-4 ">Contact: {news.contact}</p>
                    </div>
                    <div className="w-full xl:w-[95%] lg:w-[95%] md:w-[95%] py-8 bg-gray-100 rounded-lg">
                      <h3 className="text-2xl font-bold text-gray-800 text-left px-6 mb-6">GALLERY: {news.title}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
                        {news.gallery && Array.isArray(news.gallery) && news.gallery.length > 0 ? (
                          news.gallery.map((item, galleryIndex) => (
                            <div key={galleryIndex} className="relative elements overflow-hidden rounded-lg shadow-md">
                              <img
                                src={item.picture}
                                alt={item.title}
                                className="w-full h-full object-cover rounded-lg cursor-pointer"
                                onClick={() => openGallery(news.gallery, galleryIndex)}
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
      {zoomedGallery && (
        <div
          className="fixed w-full inset-0 bg-black bg-opacity-80 z-50 flex flex-col justify-center items-center"
          onClick={closeGallery}
        >
          <div className="text-white text-2xl absolute top-4 left-4 mb-4">
            {zoomedGallery.currentIndex + 1}/{zoomedGallery.gallery.length}
          </div>
          <div className="text-white text-2xl absolute top-4 right-4 mb-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareOptions(!showShareOptions);
              }}
              className="bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600"
            >
              <FaShareAlt />
            </button>

            {showShareOptions && (
              <div className="absolute text-sm size-auto top-12 right-0 bg-white text-black p-4 rounded-lg shadow-lg mt-2 flex flex-col gap-2">
                <button
                  className="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 rounded"
                  onClick={() =>
                    handleShare(
                      "facebook",
                      zoomedGallery.gallery[zoomedGallery.currentIndex].picture
                    )
                  }
                >
                  <FaFacebook /> Share on Facebook
                </button>
                <button
                  className="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 rounded"
                  onClick={() =>
                    openEmailClient(
                      zoomedGallery.gallery[zoomedGallery.currentIndex].picture
                    )
                  }
                >
                  <FaEnvelope /> Share via Email
                </button>
                <button
                  className="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 rounded"
                  onClick={() =>
                    handleShare(
                      "messenger",
                      zoomedGallery.gallery[zoomedGallery.currentIndex].picture
                    )
                  }
                >
                  <FaFacebookMessenger /> Share via Messenger
                </button>
                <button
                  className="flex items-center gap-2 py-2 px-4 hover:bg-gray-200 rounded"
                  onClick={() =>
                    handleShare(
                      "save",
                      zoomedGallery.gallery[zoomedGallery.currentIndex].picture
                    )
                  }
                >
                  <FaSave /> Save to Gallery
                </button>
              </div>
            )}
          </div>

          <div className="relative h-[70vh] w-[90vw] max-w-4xl mx-auto rounded-lg flex items-center justify-center">
            {zoomedGallery.gallery.map((image, idx) => (
              <div
                key={idx}
                className={`${
                  idx === zoomedGallery.currentIndex ? "block" : "hidden"
                } duration-700 ease-in-out`}
              >
                <img
                  src={image.picture}
                  alt={image.title}
                  draggable={false}
                  className="block w-full h-full object-contain rounded-lg"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousImage();
            }}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </span>
          </button>

          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </span>
          </button>
        </div>
      )}

      <footer>
        <Footer />
      </footer>
    </>
  );
};



export default NewsPage;
