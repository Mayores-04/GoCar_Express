"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css";

const MapWithNoSSR = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
});

type Passenger = {
  fullName: string;
  dateOfBirth: string;
  relationship: string;
  authorizedDriver: "Yes" | "No"; 
  driverLicense: string;  
};

export default function ReservationPage() {
  const [isClient, setIsClient] = useState(false);
  const [service, setService] = useState("With Driver");

  useEffect(() => {
    setIsClient(true);
  }, []);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);

  useEffect(() => {
    setPassengerDetails(
      Array.from({ length: numberOfPassengers }, (_, index) => ({
        ...passengerDetails[index],
        fullName: passengerDetails[index]?.fullName || "",
        dateOfBirth: passengerDetails[index]?.dateOfBirth || "",
        relationship: passengerDetails[index]?.relationship || "",
        authorizedDriver: passengerDetails[index]?.authorizedDriver || "No",
      }))
    );
  }, [numberOfPassengers]);

  const [passengerDetails, setPassengerDetails] = useState(
    Array.from({ length: numberOfPassengers }, () => ({
      fullName: "",
      dateOfBirth: "",
      relationship: "",
      authorizedDriver: "No",
      driverLicense: "",  
    }))
  );

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updatedPassengers = [...passengerDetails];
    updatedPassengers[index][field] = value;
    setPassengerDetails(updatedPassengers);
  };

  if (!isClient) return null;

  return (
    <>
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main className="py-16 pt-24 px-8 justify-center bg-[#263033] w-full items-center">
        <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#4169e1]">GoCar Express</span> Reservation
        </h1>

        {/* Reservation Form */}
        <section className="w-full justify-center h-auto items-center flex rounded-md">
          <form className="w-full bg-white shadow-md rounded-lg p-8">
            {/* Service Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Services We Offer
              </h2>
              <label className="block mb-2 text-gray-600">
                Select Service:
              </label>
              <select
                className="w-full p-2 border rounded"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option>With Driver</option>
                <option>Without Driver</option>
              </select>
            </div>

            {/* Renter Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Renter Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    placeholder="First Name Last Name"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Date of Birth
                  </label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    placeholder="Street, City, State, ZIP"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+63"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@domain.com"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Driver's License
                  </label>
                  <input
                    type="text"
                    placeholder="License Number, State, Expiry Date"
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Number of Passengers */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Number of Passengers
              </h2>
              <select
                className="w-full p-2 border rounded"
                value={numberOfPassengers}
                onChange={(e) => setNumberOfPassengers(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            {/* Passenger Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Passenger Information
              </h2>
              {passengerDetails.map((passenger, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg mb-4 bg-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Passenger {index + 1}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={passenger.fullName}
                        onChange={(e) =>
                          handlePassengerChange(
                            index,
                            "fullName",
                            e.target.value
                          )
                        }
                        placeholder="First Name Last Name"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) =>
                          handlePassengerChange(
                            index,
                            "dateOfBirth",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Relationship to Renter
                      </label>
                      <input
                        type="text"
                        value={passenger.relationship}
                        onChange={(e) =>
                          handlePassengerChange(
                            index,
                            "relationship",
                            e.target.value
                          )
                        }
                        placeholder="Spouse/Friend/Colleague"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Authorized Driver
                      </label>
                      <select
                        value={passenger.authorizedDriver}
                        onChange={(e) =>
                          handlePassengerChange(
                            index,
                            "authorizedDriver",
                            e.target.value
                          )
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    {/* Conditionally render the Driver's License input if authorized driver is "Yes" */}
                    {passenger.authorizedDriver === "Yes" && (
                      <div className="col-span-2">
                        <label className="block mb-2 text-gray-600">
                          Driver's License
                        </label>
                        <input
                          type="text"
                          value={passenger.driverLicense || ""}  
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "driverLicense",
                              e.target.value
                            )
                          }
                          placeholder="Enter Driver's License Number"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Additional Details
              </h2>
              <div>
                <label className="block mb-2 text-gray-600">
                  Time/Travel Duration
                </label>
                <input
                  type="text"
                  placeholder="Enter details"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Pickup Location Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Pickup Location
              </h2>
              {service === "With Driver" ? (
                <div style={{ height: "400px", width: "100%" }}>
                  <MapWithNoSSR />
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Your pickup location is fixed at:
                  </p>
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
              )}
            </div>

            {/* Rules and Regulations */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Rules and Regulations
              </h2>
              <div className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" />
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the
                  <a
                    href="/terms"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Terms & Conditions
                  </a>
                </label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-600">
                  I consent to the{" "}
                  <a
                    href="/terms"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Damage Responsibility Agreement
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-[#4169e1] text-white py-2 px-4 rounded hover:bg-[#3658c7]"
              >
                Submit Reservation
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bottom-0">
        <Footer />
      </footer>
    </>
  );
}
