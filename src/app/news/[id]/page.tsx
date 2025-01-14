"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaShareAlt,
  FaFacebook,
  FaEnvelope,
  FaFacebookMessenger,
  FaSave,
} from "react-icons/fa";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";

interface NewsPageProps {
  params: Promise<{ id: string }>;
}

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

const NewsPerId: React.FC<NewsPageProps> = ({ params }) => {
  const [newsParams, setNewsParams] = useState<{ id: string } | null>(null);
  const [zoomedGallery, setZoomedGallery] = useState<{
    gallery: { picture: string }[];
    currentIndex: number;
  } | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [newsData, setNewsData] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNewsAndParams = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/news");
        console.log(response.data.news);
        setNewsData(response.data.news);

        const resolvedParams = await params;
        setNewsParams(resolvedParams);
      } catch (err: any) {
        console.error("Error fetching news:", err.message);
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsAndParams();
  }, [params]);

  const news = newsParams
    ? newsData.find((item) => item._id.toString() === newsParams.id)
    : null;

  const openGallery = (gallery: GalleryItem[], index: number) => {
    setZoomedGallery({
      gallery: gallery.map((item) => ({ picture: item.gallery_picture })),
      currentIndex: index,
    });
  };

  const closeGallery = () => {
    setZoomedGallery(null);
    setShowShareOptions(false);
  };

  const goToNextImage = () => {
    if (zoomedGallery) {
      const nextIndex =
        (zoomedGallery.currentIndex + 1) % zoomedGallery.gallery.length;
      setZoomedGallery({ ...zoomedGallery, currentIndex: nextIndex });
    }
  };

  const goToPreviousImage = () => {
    if (zoomedGallery) {
      const prevIndex =
        (zoomedGallery.currentIndex - 1 + zoomedGallery.gallery.length) %
        zoomedGallery.gallery.length;
      setZoomedGallery({ ...zoomedGallery, currentIndex: prevIndex });
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
      if (!response.ok)
        throw new Error(
          `Failed to fetch the image. Status: ${response.status}`
        );
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

  if (loading) {
    return (
      <div>
        <header>
          <Header />
        </header>
        <div className="flex items-center h-screen justify-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          </div>
        </div>
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

  return (
    <>
      <header>
        <Header />
      </header>

      <div
        id="NewsPage"
        className="flex flex-col justify-center items-center bg-[#263033] text-white"
      >
        <section className="w-[95%] justify-center py-16 px-6 pt-24">
          <div className="bg-white justify-center items-center flex flex-col p-6 rounded-lg shadow-lg transform transition duration-300">
            <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
              <span className="text-[#4169e1]">{news.title}</span> News
            </h1>
            <div className="w-[95%] justify-center items-center">
              <div className="flex justify-center items-center w-full mb-6">
                <img
                  src={news.main_picture}
                  alt={news.title}
                  className="w-full h-auto rounded-md shadow-md"
                />
              </div>
              <h2 className="text-xl xl:text-3xl lg:text-3xl md:text-2xl text-left font-semibold text-gray-800 mb-4">
                {news.customerName} {news.title}
              </h2>
              <p className="text-gray-600 mb-4 ">{news.description}</p>
              <p className="text-gray-500 mb-4 ">{news.date}</p>
              <p className="text-gray-500 mb-4 ">{news.location}</p>
              <p className="text-gray-500 mb-4 ">Duration: {news.duration}</p>
              <p className="text-gray-500 mb-4 ">Contact: {news.contact}</p>
            </div>

            <div className="flex items-center justify-center p-3">
              <a
                href="/ReservationPage"
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  RESERVE NOW
                </span>
              </a>
            </div>

            <div className="w-full xl:w-[95%] lg:w-[95%] md:w-[95%] py-8 bg-gray-100 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-800 text-left px-6 mb-6">
                GALLERY: {news.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 px-6">
                {news.gallery?.length > 0 ? (
                  news.gallery.map((item, index) => (
                    <div
                      key={index}
                      className="relative elements overflow-hidden rounded-lg shadow-md"
                    >
                      <img
                        src={item.gallery_picture}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                        onClick={() => openGallery(news.gallery, index)}
                        draggable={false}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No images available in the gallery.
                  </p>
                )}
              </div>
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
          <div className="text-white text-2xl absolute top-4 right-20 mb-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowShareOptions(!showShareOptions);
              }}
              className="bg-blue-500 z-10 text-white p-2 rounded-lg shadow-lg hover:bg-blue-600"
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
                  alt={news.title}
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

export default NewsPerId;
