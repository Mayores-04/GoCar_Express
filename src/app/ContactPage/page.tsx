"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhoneAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const ContactPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <header>
        <Header />
      </header>

      <div id="ContactPage" className="bg-[#263033] text-white">
        {/* Contact Section */}
        <section className="w-full justify-center px-6 pt-24 py-5">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Contact Form */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <h2 className="text-3xl font-bold text-indigo-900 mb-4">
                  Get in Touch
                </h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Feel free to contact us, and we’ll get back to you as soon as
                  possible.
                </p>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    className="text-black w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="text-black w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <textarea
                    placeholder="Message"
                    className="text-black w-full min-h-[175px] p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="relative inline-flex w-full items-center justify-center  p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                  >
                    <span className="relative w-full  px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      SEND
                    </span>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Location Info */}
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-6">
                    Contact Information
                  </h3>
                  {/* Contact Information */}
                  {/* Location Info */}

                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon
                        icon={faMapMarkerAlt}
                        className="text-indigo-900 w-5 h-5"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Our Location
                        </h4>
                        <p className="text-gray-600 text-sm">
                          123 Business Street
                        </p>
                        <p className="text-gray-600 text-sm">
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                    {/* Phone */}
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon
                        icon={faPhoneAlt}
                        className="text-indigo-900 w-5 h-5"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Phone Number
                        </h4>
                        <p className="text-gray-600 text-sm">
                          +63 920 907 5454
                        </p>
                      </div>
                    </div>
                    {/* Email */}
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="text-indigo-900 w-5 h-5"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Email Address
                        </h4>
                        <p className="text-gray-600 text-sm">
                          gocarexpress0608@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white min-h-[190px] rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-6">
                    Car Availability
                  </h3>
                  <div className="space-y-4">
                    <OperationHours
                      day="Sunday - Saturday"
                      time="All Day"
                      available={false}
                    />
                    <OperationHours
                      day="February 23, 2025"
                      time="All Day"
                      available={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <footer>
        <Footer />
      </footer>
    </>
  );
};

const OperationHours = ({
  day,
  time,
  available,
}: {
  day: string;
  time: string;
  available?: boolean;
}) => (
  <div className="grid grid-cols-3 items-center gap-3">
    {/* Day */}
    <span className="text-gray-600 text-sm text-left">{day}</span>
    {/* Time */}
    <span className="text-gray-800 text-sm text-left">{time}</span>
    {/* Availability */}
    {available !== undefined && (
      <span
        className={`text-sm font-semibold ${
          available ? "text-green-500" : "text-red-500"
        }`}
      >
        {available ? "Available" : "No Available Cars"}
      </span>
    )}
  </div>
);

export default ContactPage;
