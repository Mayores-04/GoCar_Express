"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  LayersControl,
} from "react-leaflet";

// Custom Leaflet Marker Icon
const CustomIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});

export default function ReservationPage() {
  const [isClient, setIsClient] = useState(false);
  const [service, setService] = useState("With Driver");
  const [userLocation] = useState<[number, number]>([12.8797, 121.774]); // Default to the Philippines
  const [markerLocation, setMarkerLocation] = useState<[number, number] | null>(
    null
  );
  const [locationName, setLocationName] = useState<string | null>(null);

  // Ensure the code runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch location name from coordinates using Nominatim API
  const fetchLocationName = async (lat: number, lng: number) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setLocationName(data.display_name || "Unknown location");
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Unable to retrieve location name");
    }
  };

  // Handle map clicks and set marker location
  const LocationSelector: React.FC = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerLocation([lat, lng]);
        fetchLocationName(lat, lng);
      },
    });
    return markerLocation ? (
      <Marker position={markerLocation} icon={CustomIcon}></Marker>
    ) : null;
  };

  if (!isClient) return null; // Prevent server-side rendering issues

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
              <label className="block mb-2 text-gray-600">Select Service:</label>
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

            {/* Passenger Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Passenger Information
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
                    Relationship to Renter
                  </label>
                  <input
                    type="text"
                    placeholder="Spouse/Friend/Colleague"
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">
                    Authorized Driver
                  </label>
                  <select className="w-full p-2 border rounded">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Additional Details
              </h2>
              <div>
                <label className="block mb-2 text-gray-600">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  placeholder="Enter number"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mt-4">
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
                <div>
                  <p className="text-gray-600 mb-4">
                    Click on the map to specify your pickup location:
                  </p>
                  <div className="w-full h-64 border rounded">
                    <MapContainer
                      center={userLocation}
                      zoom={6}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <LayersControl position="topright">
                        {/* Standard Map */}
                        <LayersControl.BaseLayer checked name="Standard">
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                        </LayersControl.BaseLayer>

                        {/* Terrain Map */}
                        <LayersControl.BaseLayer name="Terrain">
                          <TileLayer
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://opentopomap.org/">OpenTopoMap</a> contributors'
                          />
                        </LayersControl.BaseLayer>
                      </LayersControl>

                      <LocationSelector />
                    </MapContainer>
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-600">
                      Selected Location:
                    </label>
                    {markerLocation ? (
                      <div>
                        <p className="text-gray-800">
                          Latitude: {markerLocation[0]}, Longitude:{" "}
                          {markerLocation[1]}
                        </p>
                        <p className="text-gray-800">
                          Location Name: {locationName || "Fetching..."}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600">No location selected yet.</p>
                    )}
                  </div>
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
