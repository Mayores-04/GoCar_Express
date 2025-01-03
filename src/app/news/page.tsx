"use client";

import React, { useState } from "react";
import {
  FaShareAlt,
  FaFacebook,
  FaEnvelope,
  FaFacebookMessenger,
  FaSave,
} from "react-icons/fa";
import Header from "../components/Header";

type GalleryItem = {
  title: string;
  picture: string;
  date: string;
};

type NewsItem = {
  title: string;
  description: string;
  date: string;
  location: string;
  duration: string;
  contact: string;
  picture: string;
  gallery: GalleryItem[];
};

const newsData: NewsItem[] = [
  {
    title: "Travel to Marinduque",
    description: "On December 20, 2024, experience the scenic journey...",
    date: "December 20, 2024",
    location: "Marinduque, Philippines",
    duration: "5 days",
    contact: "info@travelmarinduque.com",
    picture: "/images/mg_car.jpg",
    gallery: [
      {
        title: "Sunset View in Marinduque",
        date: "December 21, 2024",
        picture: "/images/mg_car.jpg",
      },
      {
        title: "Scenic Beaches",
        date: "December 22, 2024",
        picture: "/images/mg_car.jpg",
      },
      {
        title: "Mountain Views",
        date: "December 23, 2024",
        picture: "/images/mg_car.jpg",
      },
      {
        title: "Local Culture",
        date: "December 24, 2024",
        picture: "/images/mg_car.jpg",
      },
    ],
  },
  {
    title: "Road Trip to Baguio",
    description: "On November 10, 2024, set off for a refreshing road trip...",
    date: "November 10, 2024",
    location: "Baguio, Philippines",
    duration: "3 days",
    contact: "info@roadtripbaguio.com",
    picture: "/images/mg_car.jpg",
    gallery: [
      {
        title: "Baguio Pine Trees",
        date: "November 11, 2024",
        picture: "/images/blueLogo.png",
      },
      {
        title: "The Famous Lion's Head",
        date: "November 12, 2024",
        picture: "/images/mg_car.jpg",
      },
      {
        title: "Sunrise in Baguio",
        date: "November 13, 2024",
        picture: "/images/blueLogo.png",
      },
      {
        title: "Baguio Night Market",
        date: "November 14, 2024",
        picture: "/images/mg_car.jpg",
      },
    ],
  },
];

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
      const nextIndex =
        (zoomedGallery.currentIndex + 1) % zoomedGallery.gallery.length;
      setZoomedGallery({
        gallery: zoomedGallery.gallery,
        currentIndex: nextIndex,
      });
    }
  };

  const goToPreviousImage = () => {
    if (zoomedGallery) {
      const prevIndex =
        (zoomedGallery.currentIndex - 1 + zoomedGallery.gallery.length) %
        zoomedGallery.gallery.length;
      setZoomedGallery({
        gallery: zoomedGallery.gallery,
        currentIndex: prevIndex,
      });
    }
  };

  // Share Handlers
  const handleShare = (type: string, imageUrl: string) => {
    switch (type) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            imageUrl
          )}`,
          "_blank",
          "width=600,height=400"
        );
        break;

      case "email":
        openEmailClient(imageUrl); // Send email with embedded image
        break;

      case "messenger":
        window.open(
          `https://www.messenger.com/t/?link=${encodeURIComponent(imageUrl)}`,
          "_blank",
          "width=600,height=400"
        );
        break;

      case "save":
        saveImage(imageUrl);
        break;

      default:
        break;
    }
  };

  const openEmailClient = (imageUrl: string) => {
    const subject = "Check out this amazing image!";
    const body = `I wanted to share this image with you: <br/><img src="${imageUrl}" alt="Image"/>`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const saveImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const link = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = imageUrl.split("/").pop() || "downloaded_image";
      link.click();

      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <>
      {/* Header with Hamburger Menu */}
      <header>
        <Header />
      </header>

      <div
        id="ContactPage"
        className="flex flex-col justify-center items-center bg-[#263033] text-white"
      >
        {/* Latest News Section */}
        <section className="w-[95%] justify-center py-16 px-6 pt-24">
          <div className="max-w-full mx-auto w-full">
            <h1 className="text-left text-gray-600 text-3xl lg:text-5xl font-bold leading-tight mb-8">
              <span className="text-[#4169e1]">GoCar Express</span> Group News
            </h1>

            {/* News Cards */}
            <div className="flex flex-col gap-8">
              {newsData.map((news, index) => (
                <div
                  key={index}
                  className="bg-white flex flex-col justify-center items-center p-6 rounded-lg shadow-lg transform transition duration-300"
                >
                  <div className="w-full">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {news.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{news.description}</p>
                    <p className="text-gray-500 mb-4">{news.date}</p>
                    <p className="text-gray-500 mb-4">{news.location}</p>
                    <p className="text-gray-500 mb-4">
                      Duration: {news.duration}
                    </p>
                    <p className="text-gray-500 mb-4">
                      Contact: {news.contact}
                    </p>
                  </div>

                  {/* Big Image */}
                  <div className="w-full my-6">
                    <img
                      src={news.picture}
                      alt={news.title}
                      className="w-full h-auto rounded-md shadow-md"
                    />
                  </div>

                  {/* Description Below Image */}
                  <div className="text-gray-600 mb-4">
                    <p>{news.description}</p>
                  </div>

                  {/* Gallery Section */}
                  <div className="w-full py-8 bg-gray-100 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                      Gallery for {news.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
                      {news.gallery.map((item, galleryIndex) => (
                        <div key={galleryIndex} className="relative">
                          <img
                            src={item.picture}
                            alt={item.title}
                            className="w-full h-auto rounded-md mb-4 cursor-pointer"
                            onClick={() =>
                              openGallery(news.gallery, galleryIndex)
                            }
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {zoomedGallery && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col justify-center items-center"
          onClick={closeGallery}
        >
          {/* Image Number positioned at the top-left */}
          <div className="text-white text-2xl absolute top-4 left-4 mb-4">
            {zoomedGallery.currentIndex + 1}/{zoomedGallery.gallery.length}
          </div>
          {/* Share */}
          <div className=" text-white text-2xl absolute top-4 right-4 mb-4 z-10">
            {/* Share Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();  
                setShowShareOptions(!showShareOptions);  
              }}
              className="bg-blue-500 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600"
            >
              <FaShareAlt />
            </button>

            {/* Share Options Menu */}
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
          {/* Carousel Wrapper */}
          <div
            id="gallery"
            className="relative w-full top-4 right-4 "
            data-carousel="slide"
          >
            {/* Carousel Images */}
            <div className="relative h-auto rounded-lg">
              {zoomedGallery.gallery.map((image, idx) => (
                <div
                  key={idx}
                  className={`${
                    idx === zoomedGallery.currentIndex ? "block" : "hidden"
                  } duration-700 ease-in-out`}
                  data-carousel-item={
                    idx === zoomedGallery.currentIndex ? "active" : undefined
                  }
                >
                  <img
                    src={image.picture}
                    alt={image.title}
                    draggable={false}
                    className="absolute block max-w-full h-auto -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  />
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              type="button"
              className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
              onClick={(e) => {
                e.stopPropagation();
                goToPreviousImage();
              }}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
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
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
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
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsPage;
