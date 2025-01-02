"use client";

import React, { useEffect, useRef } from "react";
import Header from "./components/Header";
import { GsapAnimation } from "./hooks/GsapAnimation";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";
import Image from "next/image";
import NewsCard from "./components/NewsCard";

const newsCards = [
  {
    title: "Travel to Marinduque",
    description:
      "On December 20, 2024, experience the scenic journey to Marinduque, Philippines. Explore the beauty of this peaceful island, famous for its stunning beaches and vibrant culture.",
    date: "December 20, 2024",
    picture: "/images/mg_car.jpg",
  },
  {
    title: "Road Trip to Baguio",
    description:
      "On November 10, 2024, set off for a refreshing road trip to the cool highlands of Baguio. Enjoy picturesque mountain views, fresh strawberries, and a relaxing escape from the city.",
    date: "November 10, 2024",
    picture: "/images/mg_car.jpg",
  },
  {
    title: "Weekend Getaway to Tagaytay",
    description:
      "On March 15, 2024, take a weekend trip to Tagaytay for panoramic views of Taal Volcano, cool weather, and delicious local food to recharge and relax.",
    date: "March 15, 2024",
    picture: "/images/mg_car.jpg",
  },
];

const Home: React.FC = () => {
  const headerRef = GsapAnimation();

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 w-full z-50 bg-gray-300 shadow-md transition-all"
      >
        <Header />
      </header>
      <main id="Home" className="bg-gray-100 transition-all ">
        <section className="relative elements">
          <div className="relative">
            <Image
              src="/images/mg_car.jpg"
              alt="car pic"
              width={500}
              height={300}
              className="w-full h-auto object-cover elements"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center elements">
              <h1
                className="text-center text-white text-xl md:text-[35px] 
                lg:text-[65px] xl:text-[75px] font-bold leading-tight z-10"
              >
                "Driving your dreams, delivering excellence."
              </h1>
            </div>
          </div>
        </section>

        <section className=" w-full elements">
          <div className="flex flex-col items-center justify-center py-16 ">
            {/* Welcome Section */}
            <section className="text-center  py-8 px-6 w-[95%]">
              <h1
                className="text-center text-gray-600 text-xl md:text-[35px] 
                lg:text-[65px] xl:text-[75px] font-bold leading-tight"
              >
                Car Rental Philippines
              </h1>
              <p className="mt-4 text-xl text-gray-600">
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
        <section className="text-center elements bg-gray-300 py-16 px-6 w-full">
          <h1 className="text-center text-[#4169e1] text-xl md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight">
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
        <section className="text-center py-16 px-6 w-full">
          <h1 className="text-left px-6 text-gray-600 text-xl md:text-[25px] lg:text-[50px] xl:text-[60px] font-bold leading-tight">
            <span className=" text-[#4169e1]">GoCar Express</span> Group News
          </h1>
          <div className="flex flex-col w-full justify-center gap-6 mt-8">
            {newsCards.map((card, index) => (
              <NewsCard
                key={index}
                title={card.title}
                description={card.description}
                date={card.date}
                picture={card.picture}
              />
            ))}
          </div>
        </section>

        {/* Location Page Section */}
        <section
          id="LocationPage"
          className="text-center elements  bg-gray-200 py-16 px-6 w-full"
        >
          <div className="flex flex-row items-center justify-center w-[95%]">
            <div className="w-full text-center px-16">
              {" "}
              <h1 className="text-center text-[#4169e1] text-xl md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight">
                GoCar Express <span className="text-gray-600">Location</span>
              </h1>
              <p className="text-gray-500 text-[24px] py-2">
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
              className="rounded-md mt-6"
            />
          </div>
        </section>

        <footer>
          {/* Footer */}
          <Footer />
        </footer>
      </main>
    </>
  );
};

export default Home;
