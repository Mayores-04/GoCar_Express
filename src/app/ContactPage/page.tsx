"use client"
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faMapMarkerAlt, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import emailjs from "emailjs-com";
import axios from "axios";

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

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAllCars, setShowAllCars] = useState<boolean>(false);  

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

    // const EmailJsServiceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    // const EmailJsTemplateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    // const EmailJsPublicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
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

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/cars");
      setCars(response.data.cars || []);
    } catch (err: any) {
      console.error("Error fetching cars:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const toggleShowAllCars = () => {
    setShowAllCars(!showAllCars);
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
                        <p className="text-gray-600 text-sm">DM7 Barangay San Andres, Cainta Rizal</p>
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

                {/* Car Availability */}
                <div className="bg-white min-h-[170px] rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-6">Car Availability</h3>
                  <div className="space-y-4">
                    {loading ? (
                      <p>Loading car availability...</p>
                    ) : (
                      (showAllCars ? cars : cars.slice(0, 3)).map((car) => (
                        <div key={car._id} className="grid grid-cols-3 items-center gap-3">
                          <span className="text-gray-600 text-sm text-left">{car.name}</span>
                          <span
                            className={`text-sm font-semibold ${car.carstatus === "available" ? "text-green-500" : "text-red-500"}`}
                          >
                            {car.carstatus === "available" ? "Available" : "Not Available"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  {cars.length > 3 && (
                    <button
                      onClick={toggleShowAllCars}
                      className="mt-4 text-indigo-500 hover:underline"
                    >
                      {showAllCars ? "Show Less" : "Show More"}
                    </button>
                  )}
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

export default ContactPage;
