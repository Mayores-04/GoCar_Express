"use client";

import React, { useEffect, useRef } from "react";
import Header from "./components/Header";
import { GsapAnimation } from "./hooks/GsapAnimation";
import FeatureCard from "./components/FeatureCard";
import Footer from "./components/Footer";
import Image from "next/image";

export default function Home() {
  const headerRef = GsapAnimation();
  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 w-full z-50 bg-white shadow-md transition-all"
      >
        <Header />
      </header>
      <main className=" ">
        <section className="relative">
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

        <section className=" w-full ">
          <div className="flex flex-col items-center justify-center py-8 ">
            {/* Welcome Section */}
            <section className="text-center  py-8 px-6 w-[95%]">
              <h1
                className="text-center text-[#4169e1] text-xl md:text-[35px] 
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
                comfort and peace of mind knowing you're in safe hands.
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
        <section className="text-center  bg-gray-300 py-8 px-6 w-full">
          <h1 className="text-center text-[#4169e1] text-xl md:text-[35px] lg:text-[65px] xl:text-[75px] font-bold leading-tight">
            Why Choose Go Car Express?
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

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
