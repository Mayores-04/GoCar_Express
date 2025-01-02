"use client";

import React from "react";
import Header from "../components/Header";
import { GsapAnimation } from "../hooks/GsapAnimation";

export default function AboutPage() {
  const headerRef = GsapAnimation();
  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 w-full z-50 bg-white shadow-md transition-all"
      >
        <Header />
      </header>
      <main className="space-y-8 px-4 py-16">
        {/* Welcome Section */}
        <section className="text-center bg-gray-100 py-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800">
            Welcome to Go Car Express
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            At Go Car Express, we believe that great things come in small
            packages. We focus on providing a personalized car rental experience
            with the utmost attention to detail. Our aim is to offer a seamless
            and reliable car rental service with a focus on quality over
            quantity, ensuring that every journey you take with us is nothing
            short of exceptional.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-blue-800 text-white text-center py-8 px-4">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="mt-4 text-xl">
            Our mission is simple: to provide an outstanding car rental
            experience for individuals who appreciate quality, comfort, and
            convenience. With our one high-quality vehicle, we strive to ensure
            that every trip you take, whether it's a business meeting, a road
            trip, or a special occasion, is comfortable, safe, and enjoyable.
          </p>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-8 px-4">
          <h2 className="text-3xl font-semibold text-center text-blue-800">
            Why Choose Go Car Express?
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-800">
                Quality Over Quantity
              </h3>
              <p className="mt-4 text-gray-600">
                While we only offer one car, it’s a car that meets the highest
                standards of reliability and comfort. You can trust that it will
                be well-maintained, clean, and ready for your journey.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-800">
                Personalized Service
              </h3>
              <p className="mt-4 text-gray-600">
                At Go Car Express, we take the time to understand your specific
                needs and tailor the rental experience accordingly. Whether you
                need the car for a day, a week, or longer, we offer flexible
                options to make your experience as convenient as possible.
              </p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-blue-800">
                Affordable Pricing
              </h3>
              <p className="mt-4 text-gray-600">
                We offer competitive rates for our single car, ensuring that you
                can enjoy a premium rental experience at an affordable price. We
                believe in transparency, so there are no hidden fees—just great
                value.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="bg-blue-800 text-white text-center py-8 px-4">
          <h2 className="text-3xl font-semibold">Our Values</h2>
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Reliability</h3>
              <p className="text-xl mt-2">
                We understand that when you rent a car, you want peace of mind.
                That's why we ensure that our vehicle is always in top
                condition, ready to provide you with a safe and smooth driving
                experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Customer Care</h3>
              <p className="text-xl mt-2">
                We are dedicated to providing a level of service that makes
                every customer feel like a VIP. Your satisfaction is our
                priority, and we will do everything we can to make your rental
                experience easy and hassle-free.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Simplicity</h3>
              <p className="text-xl mt-2">
                With just one car in our fleet, we make the rental process
                straightforward and easy. No complicated decisions—just a great
                vehicle at a great price.
              </p>
            </div>
          </div>
        </section>

        {/* Our Vehicle Section */}
        <section className="text-center py-8 px-4">
          <h2 className="text-3xl font-semibold text-blue-800">Our Vehicle</h2>
          <p className="mt-4 text-xl text-gray-600">
            The Go Car Express Ride: We currently offer one carefully selected
            vehicle that is perfect for city driving, business trips, and
            weekend getaways. We maintain it regularly to ensure it stays in top
            condition, giving you the best driving experience.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-100 text-center py-8 px-4">
          <h2 className="text-3xl font-semibold text-blue-800">Contact Us</h2>
          <p className="mt-4 text-xl text-gray-600">
            Have any questions or need to book your rental? We're here to help!
          </p>
          <div className="mt-4">
            <p className="text-lg">Phone: [Your Contact Number]</p>
            <p className="text-lg">Email: [Your Email Address]</p>
            <p className="text-lg">Address: [Your Physical Address]</p>
          </div>
        </section>
      </main>
    </>
  );
}
