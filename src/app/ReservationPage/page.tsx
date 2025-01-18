"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

type DriverInfo = {
  fullName: string;
  licenseNumber: string;
  phoneNumber: string;
};

type RenterInfo = {
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  driverLicense: string;
};

export default function ReservationPage() {
  const [isClient, setIsClient] = useState(false);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([
    { fullName: "", dateOfBirth: "", relationship: "", authorizedDriver: "No", driverLicense: "" },
  ]);
  const [service, setService] = useState<"With Driver" | "Without Driver">("With Driver");
  const [ownDriverInfo, setOwnDriverInfo] = useState<DriverInfo>({
    fullName: "",
    licenseNumber: "",
    phoneNumber: "",
  });
  const [renterInfo, setRenterInfo] = useState<RenterInfo>({
    fullName: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    email: "",
    driverLicense: "",
  });
  const [additionalDetails, setAdditionalDetails] = useState({
    timeOrDuration: "",
  });
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [damageAgreementAccepted, setDamageAgreementAccepted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update the number of passengers and adjust the passenger details
  const updatePassengerCount = (count: number) => {
    setNumberOfPassengers(count);
    setPassengerDetails((prev) => {
      const updated = [...prev];
      if (count > prev.length) {
        while (updated.length < count) {
          updated.push({
            fullName: "",
            dateOfBirth: "",
            relationship: "",
            authorizedDriver: "No",
            driverLicense: "",
          });
        }
      } else {
        updated.length = count;
      }
      return updated;
    });
  };

  // Handle changes in passenger details
  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    setPassengerDetails((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  // Handle changes in renter's info
  const handleRenterInfoChange = (field: keyof RenterInfo, value: string) => {
    setRenterInfo({
      ...renterInfo,
      [field]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all agreements are accepted
    if (!rulesAccepted || !damageAgreementAccepted) {
      alert("Please accept all agreements before submitting.");
      return;
    }

    // Validate required fields (renter and passenger details)
    const requiredFields = [
      renterInfo.fullName,
      renterInfo.dateOfBirth,
      renterInfo.address,
      renterInfo.phoneNumber,
      renterInfo.email,
      renterInfo.driverLicense,
    ];
    if (requiredFields.some((field) => field.trim() === "")) {
      alert("Please fill all renter's details.");
      return;
    }

    const passengerRequiredFields = passengerDetails.every(
      (passenger) => passenger.fullName.trim() !== "" && passenger.dateOfBirth.trim() !== ""
    );
    if (!passengerRequiredFields) {
      alert("Please fill all passenger details.");
      return;
    }

    // Prepare reservation data
    const reservationData = {
      service,
      renterInfo,
      ownDriverInfo: service === "Without Driver" ? ownDriverInfo : null,
      passengerDetails,
      additionalDetails,
      pickupLocation: service === "With Driver" ? pickupLocation : null,
    };

    try {
      const response = await axios.post("/api/reservation", reservationData);
      if (response.status === 201) {
        toast.success("Reservation submitted successfully!");
      } else {
        toast.error("Failed to submit reservation. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting your reservation.");
    }
  };

  if (!isClient) return null;

  return (
    <>
      <header className="z-1000">
        <Header />
      </header>

      <main className="py-16 pt-24 px-8 justify-center bg-[#263033] w-full items-center">
        <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#4169e1]">GoCar Express</span> Reservation
        </h1>

        <section className="w-full justify-center h-auto items-center flex rounded-md">
          <form
            onSubmit={handleFormSubmit}
            className="w-full bg-white shadow-md rounded-lg p-8"
          >
            {/* Service Selection */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Services We Offer</h2>
              <label className="block mb-2 text-gray-600">Select Service:</label>
              <select
                className="w-full p-2 border rounded"
                value={service}
                onChange={(e) =>
                  setService(e.target.value as "With Driver" | "Without Driver")
                }
              >
                <option>With Driver</option>
                <option>Without Driver</option>
              </select>

              {/* Driver Information (Shown for "Without Driver") */}
              {service === "Without Driver" && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Driver Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block mb-2 text-gray-600">Driver's Full Name</label>
                      <input
                        type="text"
                        value={ownDriverInfo.fullName}
                        onChange={(e) =>
                          setOwnDriverInfo({
                            ...ownDriverInfo,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="First Name Last Name"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    {/* License Number */}
                    <div>
                      <label className="block mb-2 text-gray-600">Driver's License Number</label>
                      <input
                        type="text"
                        value={ownDriverInfo.licenseNumber}
                        onChange={(e) =>
                          setOwnDriverInfo({
                            ...ownDriverInfo,
                            licenseNumber: e.target.value,
                          })
                        }
                        placeholder="License Number"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    {/* Phone Number */}
                    <div>
                      <label className="block mb-2 text-gray-600">Driver's Phone Number</label>
                      <input
                        type="tel"
                        value={ownDriverInfo.phoneNumber}
                        onChange={(e) =>
                          setOwnDriverInfo({
                            ...ownDriverInfo,
                            phoneNumber: e.target.value,
                          })
                        }
                        placeholder="Phone Number"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Renter Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Renter Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={renterInfo.fullName}
                    onChange={(e) =>
                      handleRenterInfoChange("fullName", e.target.value)
                    }
                    placeholder="First Name Last Name"
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Date of Birth */}
                <div>
                  <label className="block mb-2 text-gray-600">Date of Birth</label>
                  <input
                    type="date"
                    value={renterInfo.dateOfBirth}
                    onChange={(e) =>
                      handleRenterInfoChange("dateOfBirth", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Address */}
                <div>
                  <label className="block mb-2 text-gray-600">Address</label>
                  <input
                    type="text"
                    value={renterInfo.address}
                    onChange={(e) =>
                      handleRenterInfoChange("address", e.target.value)
                    }
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Phone Number */}
                <div>
                  <label className="block mb-2 text-gray-600">Phone Number</label>
                  <input
                    type="tel"
                    value={renterInfo.phoneNumber}
                    onChange={(e) =>
                      handleRenterInfoChange("phoneNumber", e.target.value)
                    }
                    placeholder="Phone Number"
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block mb-2 text-gray-600">Email</label>
                  <input
                    type="email"
                    value={renterInfo.email}
                    onChange={(e) =>
                      handleRenterInfoChange("email", e.target.value)
                    }
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Driver License */}
                <div>
                  <label className="block mb-2 text-gray-600">Driver's License</label>
                  <input
                    type="text"
                    value={renterInfo.driverLicense}
                    onChange={(e) =>
                      handleRenterInfoChange("driverLicense", e.target.value)
                    }
                    placeholder="Driver's License"
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
                onChange={(e) => updatePassengerCount(Number(e.target.value))}
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
                    {/* Full Name */}
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

                    {/* Date of Birth */}
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

                    {/* Relationship to Renter */}
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

                    {/* Authorized Driver */}
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

                    {/* Conditionally render Driver's License input */}
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

            {/* Additional Details */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-600">Additional Details</label>
              <textarea
                value={additionalDetails.timeOrDuration}
                onChange={(e) =>
                  setAdditionalDetails({
                    ...additionalDetails,
                    timeOrDuration: e.target.value,
                  })
                }
                placeholder="Time or Duration"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Pickup Location (Shown for "With Driver") */}
            {service === "With Driver" && (
              <div className="mb-6">
                <label className="block mb-2 text-gray-600">Pickup Location</label>
                <input
                  type="text"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Pickup Location"
                  className="w-full p-2 border rounded"
                />
                <MapWithNoSSR />
              </div>
            )}

            {/* Agreement */}
            <div className="mb-6">
              <label className="inline-flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rulesAccepted}
                  onChange={(e) => setRulesAccepted(e.target.checked)}
                />
                I accept the rental rules
              </label>
              <br />
              <label className="inline-flex items-center text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={damageAgreementAccepted}
                  onChange={(e) => setDamageAgreementAccepted(e.target.checked)}
                />
                I accept the damage agreement
              </label>
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button type="submit" className="w-full py-2 px-4 bg-[#4169e1] text-white rounded-lg">
                Submit Reservation
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
