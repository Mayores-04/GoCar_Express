import React from "react";
import Header from "../components/Header"; 

const ContactPage: React.FC = () => {
  return (
    <div id="ContactPage" className="bg-[#263033] text-white">
      {/* Header */}
      <Header />
 
      <section id="ContactPage" className="flex items-center justify-center h-screen px-6 bg-blue-400 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl mb-4">
            We’d love to hear from you! Whether you have a question about our services, need assistance, or just want to share feedback,
            feel free to reach out to us. Here are our contact details:
          </p>
          <div className="text-lg mb-4">
            <p><strong>Email:</strong> support@yourwebsite.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Your Street, City, Country</p>
          </div>
          <p className="text-lg">
            Alternatively, you can fill out the contact form below and we’ll get back to you as soon as possible.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
