"use client"

import React, { useState } from "react"
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ReservationPage() {
    const [service, setService] = useState("With Driver");

  return (
    <>
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Section */}
      <main className="py-16 pt-24 px-8 justify-center bg-[#263033] w-full items-center">
        <h1 className="text-left text-gray-600 text-3xl mt-4 lg:text-5xl font-bold leading-tight mb-8">
          <span className="text-[#4169e1]">GoCar Express</span> Reservation
        </h1>

        {/* Reservation Form Section */}
        <section className="w-full justify-center h-auto items-center flex py-8 rounded-md">
          <form className="w-full bg-white shadow-md rounded-lg p-8">
            {/* Services Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Services We Offer</h2>
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Renter Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input type="text" placeholder="First Name Last Name" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Date of Birth</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Residential Address</label>
                  <input type="text" placeholder="Street, City, State, ZIP" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Phone Number</label>
                  <input type="tel" placeholder="+63" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Email Address</label>
                  <input type="email" placeholder="example@domain.com" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Driver's License</label>
                  <input type="text" placeholder="License Number, State, Expiry Date" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Passenger Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-600">Full Name</label>
                  <input type="text" placeholder="First Name Last Name" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Date of Birth</label>
                  <input type="date" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Relationship to Renter</label>
                  <input type="text" placeholder="Spouse/Friend/Colleague" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Authorized Driver</label>
                  <select className="w-full p-2 border rounded">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Additional Details</h2>
              <div>
                <label className="block mb-2 text-gray-600">Number of Passengers</label>
                <input type="number" placeholder="Enter number" className="w-full p-2 border rounded" />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-gray-600">Time/Travel Duration</label>
                <input type="text" placeholder="Enter details" className="w-full p-2 border rounded" />
              </div>
            </div>

           {/* Pickup Location Section */}
           <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Pickup Location</h2>
              {service === "With Driver" ? (
                <div>
                  <p className="text-gray-600 mb-4">Specify your pickup location on the map below:</p>
                  <div className="w-full h-64 border rounded">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509892!2d144.95565131531635!3d-37.8172099797515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5777a3d5d07f4f1!2sFederation%20Square!5e0!3m2!1sen!2sph!4v1689774846207!5m2!1sen!2sph"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                    //   allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <label className="block mt-4 text-gray-600">Specific Pickup Instructions</label>
                  <textarea
                    placeholder="Enter any additional pickup details here"
                    className="w-full p-2 border rounded h-20"
                  ></textarea>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">This is where you pick our car:</p>
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Rules and Regulations</h2>
              <div className="flex items-center mb-4">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-600">I agree to the Terms & Conditions</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <label className="text-gray-600">I consent to the Damage Responsibility Agreement</label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button type="submit" className="w-full bg-[#4169e1] text-white py-2 px-4 rounded hover:bg-[#3658c7]">
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
