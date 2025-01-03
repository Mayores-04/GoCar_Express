import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Sample news data
const newsData = [
  {
    title: "Travel to Marinduque",
    description: "On December 20, 2024, experience the scenic journey...",
    date: "December 20, 2024",
    location: "Marinduque, Philippines",
    duration: "5 days",
    contact: "info@travelmarinduque.com",
    picture: "/images/mg_car.jpg",
  },
  {
    title: "Road Trip to Baguio",
    description: "On November 10, 2024, set off for a refreshing road trip...",
    date: "November 10, 2024",
    location: "Baguio, Philippines",
    duration: "3 days",
    contact: "info@roadtripbaguio.com",
    picture: "/images/mg_car.jpg",
  },
];

const ContactPage: React.FC = () => {
  return (
    <>
      {/* Header */}
      <Header />
      <div
        id="ContactPage"
        className=" flex flex-col justify-center items-center bg-[#263033] text-white"
      >
        {/* Latest News Section */}
        <section className="w-[95%] justify-center py-16 px-6 pt-24">
          <div className="max-w-full mx-auto w-full">
            <h1 className="text-left text-gray-600 text-3xl lg:text-5xl font-bold leading-tight mb-8">
              <span className="text-[#4169e1]">GoCar Express</span> Group News
            </h1>

            {/* News Cards Container */}
            <div className="flex flex-col gap-8">
              {newsData.map((news, index) => (
                <div
                  key={index}
                  className="bg-white grid grid-cols-2 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {news.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{news.description}</p>
                    <p className="text-gray-500 mb-4">{news.date}</p>
                  </div>

                  {/* Image */}
                  {news.picture && (
                    <img
                      src={news.picture}
                      alt={news.title}
                      className="w-full h-auto rounded-md mb-4"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default ContactPage;
