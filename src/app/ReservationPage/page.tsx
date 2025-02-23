"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
  carId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  authorizedDriver: "Yes" | "No";
  driverLicense: string;
};

interface Car {
  _id: string;
  carstatus: string;
  name: string;
  brand: string;
  seats: number;
  price: number;
  picture: string;
  description: string;
}

export default function ReservationPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("api/cars");

      setCars(response.data.cars || []);
      setLoading(false);
    } catch (erro) {
      toast.error("Failed to fetch cars. Please try again later.");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCars();
  }, []);

  const [pickupLocation, setPickupLocation] = useState<string>("");

  const [isClient, setIsClient] = useState(false);
  const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState<Passenger[]>([
    {
      fullName: "",
      dateOfBirth: "",
      relationship: "",
      authorizedDriver: "No",
      driverLicense: "",
    },
  ]);
  const [service, setService] = useState<"With Driver" | "Without Driver">(
    "With Driver"
  );

  const [ownDriverInfo, setOwnDriverInfo] = useState<DriverInfo>({
    fullName: "",
    licenseNumber: "",
    phoneNumber: "",
  });

  const [renterInfo, setRenterInfo] = useState<RenterInfo>({
    carId: "",
    fullName: "",
    dateOfBirth: "",
    address: "",
    phoneNumber: "",
    email: "",
    authorizedDriver: "No",
    driverLicense: "",
  });
  const [additionalDetails, setAdditionalDetails] = useState({
    timeOrDuration: "",
  });
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [damageAgreementAccepted, setDamageAgreementAccepted] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    setPassengerDetails((prev) =>
      prev.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const handleRenterInfoChange = (field: keyof RenterInfo, value: string) => {
    setRenterInfo({ ...renterInfo, [field]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validation: Ensure all agreements are accepted
      if (!rulesAccepted || !damageAgreementAccepted) {
        toast.error("Please accept all agreements before submitting.");
        return;
      }

      // Validation: Ensure all required renter fields are filled
      const renterRequiredFields = [
        renterInfo?.fullName,
        renterInfo?.dateOfBirth,
        renterInfo?.address,
        renterInfo?.phoneNumber,
        renterInfo?.email,
        renterInfo?.driverLicense,
      ];

      if (renterRequiredFields.some((field) => !field || field.trim() === "")) {
        toast.error("Please fill in all renter's details.");
        return;
      }

      // Validation: Ensure `timeOrDuration` is provided
      if (!additionalDetails?.timeOrDuration) {
        toast.error("Time travel duration is required.");
        return;
      }

      // Validation: Ensure passenger details are complete
      const allPassengersValid = passengerDetails.every(
        (passenger) =>
          passenger?.fullName?.trim() !== "" &&
          passenger?.dateOfBirth?.trim() !== ""
      );

      if (!allPassengersValid) {
        toast.error("Please fill in all passenger details.");
        return;
      }

      // Format pickup location based on the selected service
      const formattedPickupLocation =
        service === "With Driver" ? pickupLocation : null;

      const selectedCar = cars.find((car) => car._id === renterInfo.carId);

      const reservationData = {
        car: {
          ...selectedCar,
          carId: selectedCar?._id || "",
          carName: selectedCar?.name || "",
        },
        service,
        renterInfo,
        ownDriverInfo:
          service === "Without Driver" ? ownDriverInfo : ownDriverInfo,
        numberOfPassengers,
        passengerDetails,
        additionalDetails: {
          ...additionalDetails,
          timeTravelDuration: additionalDetails?.timeOrDuration,
        },
        pickupLocation: formattedPickupLocation,
      };

      console.log("Data to be sent to the server:", reservationData);

      // Make API request
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData?.msg || "An error occurred while making the reservation."
        );
      }

      // Log and display success message
      console.log("Response:", responseData);
      toast.success("Reservation created successfully!");
    } catch (error: any) {
      // Handle errors gracefully
      console.error("Error in handleFormSubmit:", error);
      toast.error(
        error.message || "An error occurred while making the reservation."
      );
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "carId") {
      const selectedCar = cars.find((car) => car._id === value);
      setRenterInfo((prev) => ({
        ...prev,
        carId: value,
        carName: selectedCar?.name || "",
      }));
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
            {/* Available Cars */}
            <div className="border border-gray-300 px-4 py-2">
              <select
                name="carId"
                onChange={handleInputChange}
                className="p-2 border rounded"
              >
                <option value="">Select Car</option>
                {cars.some((car) => car.carstatus === "Available") ? (
                  cars
                    .filter((car) => car.carstatus === "Available")
                    .map((car) => (
                      <option key={car._id} value={car._id}>
                        {car.name} ({car.brand}) {/* - ₱{car.price} */}
                      </option>
                    ))
                ) : (
                  <option disabled>No available cars</option>
                )}
              </select>
            </div>

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
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Driver Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Driver's Full Name
                      </label>
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
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Driver's License Number
                      </label>
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
                    <div>
                      <label className="block mb-2 text-gray-600">
                        Driver's Phone Number
                      </label>
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Renter's Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input
                    type="text"
                    value={renterInfo.fullName}
                    onChange={(e) =>
                      handleRenterInfoChange("fullName", e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={renterInfo.dateOfBirth}
                    onChange={(e) =>
                      handleRenterInfoChange("dateOfBirth", e.target.value)
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2 text-gray-600">Address</label>
                  <input
                    type="text"
                    value={renterInfo.address}
                    onChange={(e) =>
                      handleRenterInfoChange("address", e.target.value)
                    }
                    placeholder="123 Main St"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Phone Number
                  </label>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block mb-2 text-gray-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={renterInfo.email}
                    onChange={(e) =>
                      handleRenterInfoChange("email", e.target.value)
                    }
                    placeholder="john.doe@example.com"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Driver's License
                  </label>
                  <input
                    type="text"
                    value={renterInfo.driverLicense || ""}
                    onChange={(e) =>
                      handleRenterInfoChange("driverLicense", e.target.value)
                    }
                    placeholder="Enter Driver's License Number or none"
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
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
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

            {/* Additional Information */}
            <div className="mb-6">
              <label className="block mb-2 text-gray-600">
                Additional Details (Time/Duration)
              </label>
              <input
                type="text"
                value={additionalDetails.timeOrDuration}
                onChange={(e) =>
                  setAdditionalDetails({
                    ...additionalDetails,
                    timeOrDuration: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            {/* Agreements */}
            <div className="mb-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rulesAccepted}
                  onChange={() => setRulesAccepted(!rulesAccepted)}
                  className="w-4 h-4"
                />
                <span>I accept the rental terms and conditions</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={damageAgreementAccepted}
                  onChange={() =>
                    setDamageAgreementAccepted(!damageAgreementAccepted)
                  }
                  className="w-4 h-4"
                />
                <span>I accept responsibility for any damages</span>
              </label>
            </div>

            {service === "With Driver" ? (
              <div className="mb-6">
                <label className="block mb-2 text-gray-600">
                  Pickup Location
                </label>
                <MapWithNoSSR
                  setLocation={setPickupLocation}
                  pickupLocation={pickupLocation}
                />
              </div>
            ) : (
              <div className="mb-6">
                <label className="block mb-2 text-gray-600">
                  Pickup Location
                </label>
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

            {/* Submit Button */}
            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg"
              >
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
