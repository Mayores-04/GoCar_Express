"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

interface Car {
  _id: string;
  name: string;
  brand: string;
  seats: number;
  picture: string;
  description: string;
}

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      const response = await axios.get("/api/cars");
      setCars(response.data.cars || []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching cars:", err.message);
      setError("Failed to fetch cars. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <section className="py-16 pt-24 px-8 justify-center bg-[#263033] w-full items-center">
        <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#4169e1]">GoCar Express</span> CARS
        </h1>
        <div className={`grid grid-cols-1 sm:grid-cols-1  xl:grid-cols-2  lg:grid-cols-2  md:grid-cols-1 gap-8`}>
          {cars.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 items-start gap-8"
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="font-bold text-[#263033] text-xl mt-4  sm:text-2xl  md:text-2xl lg:text-4xl xl:text-5xl">
                    {car.name || "No name available"}
                  </h2>
                  <p className="text-gray-500 mt-3 text-md sm:text-md  md:text-lg  lg:text-xl xl:text-2xl">
                    Brand: {car.brand || "No brand available"}
                  </p>
                  <p className="text-gray-500 mt-3 text-sm sm:text-sm  md:text-md  lg:text-lg xl:text-xl">
                    {car.description || "No description available"}
                  </p>
                </div>

                <div className="mt-3 text-md sm:text-md  md:text-lg  lg:text-xl xl:text-2xl text-gray-500">
                  <p>Seats: {car.seats || "N/A"}</p>
                </div>
              </div>
              <div className="justify-center items-center flex">
                <img
                  src={car.picture || "/images/placeholder.jpg"}
                  alt={`${car.name} Image`}
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
