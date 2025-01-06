"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Cars = [
  {
    Name: "MG ZS",
    Brand: "MG ZS",
    Seats: 5,
    Picture: "/images/monggi.png",
    Description:
      "The MG ZS is a compact SUV offering a blend of style, practicality, and affordability. It features a 1.5-liter engine producing 112 horsepower, with a 0 to 100 km/h time of approximately 10.9 seconds. The car is equipped with modern tech such as a 12.3-inch touchscreen display and advanced safety features.",
  },
  {
    Name: "Toyota Corolla",
    Brand: "Toyota",
    Seats: 5,
    Picture: "/images/image1.png",
    Description:
      "The Toyota Corolla is a reliable and fuel-efficient compact sedan. With a 1.6-liter engine, it offers comfortable ride quality and longevity. The Corolla comes with a modern infotainment system, a touchscreen display, and advanced safety features such as Toyota Safety Sense.",
  },
  {
    Name: "Honda Civic",
    Brand: "Honda",
    Seats: 5,
    Picture: "/images/image2.png",
    Description:
      "The Honda Civic is a compact car known for its sporty performance and practicality. It features a 1.5-liter engine producing 180 horsepower and 240 Nm of torque. The Civic provides a refined interior with a 9-inch navigation system and a spacious cabin, making it an ideal choice for those who want performance and comfort.",
  },
];

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
              <div>
                <h2 className="text-xl font-bold text-[#263033]">{car.Name}</h2>
                <p className="text-gray-500 mt-2">{car.Brand}</p>
                <p className="text-gray-500 mt-2">{car.Description}</p>
                <p className="text-gray-500 mt-2">Seats: {car.Seats}</p>
              </div>

              <div>
                <img
                  src={car.Picture || "/images/placeholder.jpg"}
                  alt={`${car.Name} Image`}
                  className="w-full max-h-[550px] object-center rounded-lg"
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
