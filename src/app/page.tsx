"use client";

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { GsapAnimation } from "../lib/hooks/GsapAnimation";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";
import Image from "next/image";
import NewsCard from "./components/NewsCard";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

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

const Home: React.FC = () => {
  const headerRef = GsapAnimation();

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
        toast.error("Error fetching news:", err.message);
        // setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 w-full z-50 bg-gray-300 shadow-md transition-all"
      >
        <Header />
      </header>
      <main id="Home" className="bg-[#364043] transition-all ">
        <section className="relative elements">
          <div className="relative">
            <Image
              src="/mg_car.jpg"
              alt="car pic"
              width={500}
              height={300}
              className="opacity-[60%] w-full pt-20 xl:pt-0 lg:pt-2 md:pt-10 h-screen xl:h-auto lg:h-auto md:h-auto sm:h-screen object-cover elements"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center elements">
              <h1
                className="text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-200 to-white 
             text-4xl p-6 md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight z-10"
              >
                "Driving your dreams, delivering excellence."
              </h1>
            </div>
          </div>
        </section>

        <section className=" w-full ">
          <div className="flex flex-col items-center justify-center py-16 ">
            {/* Welcome Section */}
            <section className="text-center  px-6 w-full xl:w-[95%] lg:w-[95%] md:w-[95%] ">
              <h1
                className="text-center elements text-gray-300 text-3xl md:text-[35px] 
                lg:text-[65px] xl:text-[75px] font-bold leading-tight"
              >
                Car Rental Philippines
              </h1>
              <p className="mt-4 elements text-lg xl:text-xl lg:text-xl text-gray-200">
                At Go Car Express, we are committed to providing a seamless,
                high-quality car rental experience. Whether you're looking to
                rent for a business trip, leisure, or a special occasion, we
                ensure that every journey is smooth, reliable, and stress-free.
                <br />
                <br />
                With our single, carefully maintained vehicle, you can enjoy
                comfort and peace of mind knowing you’re in safe hands.
                <br />
                <br />
                We prioritize customer satisfaction and offer flexible rental
                periods, transparent pricing, and no hidden fees. From pick-up
                to drop-off, your convenience is our priority. Our agreement
                outlines everything you need to know about your rental, ensuring
                clarity and transparency every step of the way.
                <br />
                <br />
                Thank you for choosing Go Car Express. We look forward to
                providing you with a premium car rental experience tailored to
                your needs.
              </p>
            </section>
          </div>
        </section>

        {/* FeatureCard Section */}
        <section className="text-center  bg-gray-300 py-16 px-6 w-full">
          <h1 className="text-center elements text-[#4169e1] text-xl md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight">
            <span className="text-gray-600">Why Choose</span> GoCar Express{" "}
            <span className="text-gray-600">?</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <FeatureCard
              title="Comfortable Ride"
              description="Our vehicle is maintained for the utmost comfort, ensuring that every trip is pleasant."
              icon="🚗"
            />
            <FeatureCard
              title="Flexible Rental Periods"
              description="Choose rental periods that best suit your needs, whether it's for a day, a week, or longer."
              icon="⏳"
            />
            <FeatureCard
              title="Transparent Pricing"
              description="We offer clear and competitive pricing with no hidden fees."
              icon="💲"
            />
          </div>
        </section>

        {/* Latest News Section */}
        <section id="NewsSection" className="text-center py-16 px-6 w-full">
          <h1 className="text-left mb-4 px-6 text-gray-600 text-xl md:text-[25px] lg:text-[50px] xl:text-[60px] font-bold">
            <span className=" text-[#4169e1]">GoCar Express</span> Group News
          </h1>
          <h2 className="elements p-4 px-8 items-left justify-center text-left">
            <Link
              href={`NewsPage`}
              className="text-black bg-gray-400 p-4 rounded-lg font-semibold hover:underline"
            >
              View all News
            </Link>
          </h2>

          <div className="flex flex-col w-full justify-center px-8 gap-6 mt-3">
            {news.length > 0 ? (
              news.map((item) => (
                <NewsCard
                  key={item._id}
                  _id={item._id} 
                  title={item.title}
                  main_picture={item.main_picture}
                  description={item.description}
                  date={item.date}
                  location={item.location}
                  duration={item.duration}  
                  contact={item.contact} 
                  gallery={item.gallery} 
                />
              ))
            ) : (
              <div>
                <header>
                  <Header />
                </header>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Location Page Section */}
        <section
          id="LocationPage"
          className="text-center  bg-gray-200 py-16 px-6 w-full"
        >
          <div className="flex flex-col elements justify-center items-center lg:flex-row md:flex-col xl:flex-row sm:flex-col w-full xl:w-[95%] lg:w-[95%]">
            <div className="w-full elements text-center px-0 xl:px-16 ">
              {" "}
              <h1 className="text-center text-[#4169e1] text-3xl md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight">
                GoCar Express <span className="text-gray-600">Location</span>
              </h1>
              <p className="text-gray-500 text-lg xl:text-2xl lg:text-xl md:text-xl py-2">
                Conveniently located in the heart of Cainta, Rizal, GoCar
                Express provides easy access for all your car rental needs.
                Whether you're heading out for business or leisure, our central
                location ensures that you can quickly pick up and drop off your
                vehicle with ease.
              </p>
            </div>
            <iframe
              id="location"
              src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=0002 Lot B Guadalupe St. DM7&amp;t=h&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-md mt-6 elements"
            />
          </div>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default Home;
