"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import emailjs from "emailjs-com";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);   

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const { name, email, message } = formData;
    
    if (!name || !email || !message) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    setIsSubmitting(true);

    emailjs
      .send(
        "service_m3dpnab", // EmailJS service ID
        "template_q6jrl2a", // EmailJS template ID
        templateParams,
        "iBZ8SO0eOANEm6G86" // EmailJS public key
      )
      .then(
        (response) => {
          console.log("Message sent successfully:", response);
          toast.success("Thank you for your message! We will assure you that Jake will receive this message.");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error("Failed to send message:", error);
          toast.error("Something went wrong. Please try again later.");
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <header>
        <Header />
      </header>

      <div id="ContactPage" className="bg-[#263033] text-white">
        <section className="w-full justify-center px-6 pt-24 py-5">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
                <h2 className="text-3xl font-bold text-indigo-900 mb-4">Get in Touch</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-black w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="text-black w-full p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="text-black w-full min-h-[175px] p-3 rounded-lg bg-white border text-sm border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={isSubmitting}   
                    className="relative inline-flex w-full items-center text-gray-200 justify-center p-0.5 text-sm font-medium  rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
                  >
                    <span className="relative w-full px-5 py-2.5 dark:bg-gray-900 rounded-md">
                      {isSubmitting ? "Sending..." : "SEND"}
                    </span>
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-indigo-900 w-5 h-5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Our Location</h4>
                        <p className="text-gray-600 text-sm">123 Business Street, New York, NY 10001</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon icon={faPhoneAlt} className="text-indigo-900 w-5 h-5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Phone Number</h4>
                        <p className="text-gray-600 text-sm">+63 920 907 5454</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FontAwesomeIcon icon={faEnvelope} className="text-indigo-900 w-5 h-5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Email Address</h4>
                        <p className="text-gray-600 text-sm">gocarexpress0608@gmail.com</p>
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
    <span className="text-gray-600 text-sm text-left">{day}</span>
    <span className="text-gray-800 text-sm text-left">{time}</span>
    {available !== undefined && (
      <span
        className={`text-sm font-semibold ${available ? "text-green-500" : "text-red-500"}`}
      >
        {available ? "Available" : "No Available Cars"}
      </span>
    )}
  </div>
);

export default ContactPage;
