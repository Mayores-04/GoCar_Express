"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Cars } from "../data/cars";

const CarsPage: React.FC = () => {
  const gridCols = Cars.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <>
      <header>
        <Header />
      </header>

      <section className="py-16 pt-24 px-8 justify-center bg-[#263033] w-full items-center">
        <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#4169e1]">GoCar Express</span> CARS
        </h1>

        <div className={`grid ${gridCols} gap-8`}>
          {Cars.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-8"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-bold text-[#263033] text-3xl mt-4 lg:text-5xl">
                    {car.Name}
                  </h2>
                  <p className="text-gray-500 mt-3 text-2xl lg:text-4xl">
                    Brand: {car.Brand}
                  </p>
                  <p className="text-gray-500 mt-3 text-xl">
                    {car.Description}
                  </p>
                </div>

                <div className="mt-3 text-xl text-gray-500">
                  <p>Seats: {car.Seats}</p>
                </div>
              </div>

              <div className="justify-center items-center flex">
                <img
                  src={car.Picture || "/images/placeholder.jpg"}
                  alt={`${car.Name} Image`}
                  className="w-auto max-h-[550px] object-center rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default CarsPage;
