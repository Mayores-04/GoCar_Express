import React, { useEffect, useState } from "react";

const CarRentalBooking = ({ onClose }: { onClose: () => void }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Disable scrolling on the background when the modal is open
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when the modal is closed
      document.body.style.overflow = "";
    };
  }, []);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAccepted) {
      alert("You must accept the rules and regulations to proceed.");
      return;
    }
    alert("Booking submitted successfully!");
    onClose();
  };

  const toggleAcceptance = () => setIsAccepted(!isAccepted);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Car Rental Booking
        </h2>

        {/* Scrollable Form Container */}
        <div
          className="max-h-[70vh] overflow-y-auto"
          style={{ paddingRight: "0.5rem" }}
        >
          <form onSubmit={handleBookingSubmit}>
            {/* Full Name */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2 text-black border rounded-md"
                placeholder="Enter your full name"
              />
            </div>

            {/* Contact Number */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="contact"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                required
                className="w-full px-4 py-2  text-black  border rounded-md"
                placeholder="Enter your contact number"
              />
            </div>

            {/* Pickup Location with Map */}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="pickupLocation"
              >
                Pickup Location
              </label>
              <p className="text-sm text-gray-500 mb-2">
                The car will be available at the following location:
              </p>
              <div className="w-full h-48 border rounded-md overflow-hidden mb-4">
                <iframe
                  src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=0002 Lot B Guadalupe St. DM7&amp;t=h&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  width="100%"
                  height="100%"
                  allowFullScreen={true}
                  loading="lazy"
                  title="Pickup Location"
                />
              </div>
            </div>

            {/* Rules and Regulations */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Rules and Regulations
              </h3>
              <ul className="text-sm text-gray-600 list-disc pl-5 mb-2">
                <li>Ensure to return the car on time to avoid late fees.</li>
                <li>
                  The car should be returned with the same fuel level as at
                  pickup.
                </li>
                <li>No smoking or carrying prohibited items in the car.</li>
                <li>Contact customer service for emergencies or accidents.</li>
              </ul>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="acceptRules"
                  checked={isAccepted}
                  onChange={toggleAcceptance}
                  className="h-5 w-5"
                />
                <label htmlFor="acceptRules" className="text-sm text-gray-700">
                  I have read and agree to the rules and regulations.
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-6 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isAccepted}
            className={`px-6 py-2 rounded-md ${
              isAccepted
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Submit Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRentalBooking;
