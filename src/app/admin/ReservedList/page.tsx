"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface RenterInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
}

interface DriverInfo {
  fullName: string;
  licenseNumber: string;
  phoneNumber: string;
}

interface PassengerDetails {
  fullName: string;
  dateOfBirth: string;
  relationship: string;
  authorizedDriver: boolean;
  driverLicense?: string;
}

interface AdditionalDetails {
  timeTravelDuration: string;
}

interface Reservation {
  _id: string;
  service: string;
  renterInfo: RenterInfo;
  ownDriverInfo: DriverInfo;
  numberOfPassengers: number;
  pickupLocation: string;
  passengerDetails: PassengerDetails[];
  additionalDetails: AdditionalDetails;
}

const ReservationTable: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [expandedReservationId, setExpandedReservationId] = useState<string | null>(null);
  const [emailModal, setEmailModal] = useState<{
    show: boolean;
    recipient: RenterInfo | null;
  }>({
    show: false,
    recipient: null,
  });
  const [emailMessage, setEmailMessage] = useState<string>("");

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
      } else {
        console.error("Failed to fetch reservations:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const toggleDetails = (reservationId: string) => {
    setExpandedReservationId((prevId) => (prevId === reservationId ? null : reservationId));
  };

  // Approve a reservation
  const handleApprove = async (reservation: Reservation) => {
    try {
      console.log(`Approving reservation for ${reservation.renterInfo.email}`);
      // Simulated email logic
      toast.success(`Reservation approved for ${reservation.renterInfo.fullName}`);
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error("Failed to approve reservation.");
    }
  };

  // Cancel a reservation
  const handleCancel = async (reservation: Reservation) => {
    try {
      console.log(`Cancelling reservation for ${reservation.renterInfo.email}`);
      // Simulated email logic
      toast.success(`Reservation cancelled for ${reservation.renterInfo.fullName}`);
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation.");
    }
  };

  // Open email modal
  const handleOpenEmailModal = (renterInfo: RenterInfo) => {
    setEmailModal({ show: true, recipient: renterInfo });
  };

  // Close email modal
  const handleCloseEmailModal = () => {
    setEmailModal({ show: false, recipient: null });
    setEmailMessage("");
  };

  // Send email
  const handleSendEmail = async () => {
    if (!emailModal.recipient) return;

    try {
      console.log("Sending custom message to:", emailModal.recipient.email);
      console.log("Message:", emailMessage);
      toast.success(`Message sent to ${emailModal.recipient.fullName}`);
      handleCloseEmailModal();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">Reservation #</th>
            <th className="px-4 py-2 text-left text-gray-600">Service</th>
            <th className="px-4 py-2 text-left text-gray-600">Renter Name</th>
            <th className="px-4 py-2 text-left text-gray-600">Email</th>
            {/* <th className="px-4 py-2 text-left text-gray-600">Passengers</th> */}
            <th className="px-4 py-2 text-left text-gray-600">Pickup Location</th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <React.Fragment key={reservation._id}>
              <tr>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{reservation.service}</td>
                <td className="border px-4 py-2">{reservation.renterInfo.fullName}</td>
                <td className="border px-4 py-2">{reservation.renterInfo.email}</td>
                {/* <td className="border px-4 py-2">{reservation.numberOfPassengers}</td> */}
                <td className="border px-4 py-2">{reservation.pickupLocation}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleDetails(reservation._id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedReservationId === reservation._id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    onClick={() => handleOpenEmailModal(reservation.renterInfo)}
                    className="text-green-500 hover:underline"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => handleApprove(reservation)}
                    className="text-green-600 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleCancel(reservation)}
                    className="text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
              {expandedReservationId === reservation._id && (
                <tr>
                  <td colSpan={6} className="border px-4 py-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">Details</h3>
                      <div>
                        <strong>Driver Information:</strong>
                        <p>Full Name: {reservation.ownDriverInfo.fullName || "N/A"}</p>
                        <p>License: {reservation.ownDriverInfo.licenseNumber || "N/A"}</p>
                        <p>Phone: {reservation.ownDriverInfo.phoneNumber || "N/A"}</p>
                      </div>
                      {reservation.passengerDetails.map((passenger, i) => (
                        <div key={i}>
                          <strong>Passenger {i + 1}:</strong>
                          <p>Name: {passenger.fullName}</p>
                          <p>DOB: {passenger.dateOfBirth}</p>
                          <p>Relationship: {passenger.relationship}</p>
                          <p>Authorized Driver: {passenger.authorizedDriver ? "Yes" : "No"}</p>
                          {passenger.authorizedDriver && (
                            <p>Driver's License: {passenger.driverLicense || "N/A"}</p>
                          )}
                        </div>
                      ))}
                      <div>
                        <strong>Additional Details:</strong>
                        <p>Time/Travel Duration: {reservation.additionalDetails.timeTravelDuration}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Email Modal */}
      {emailModal.show && emailModal.recipient && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">Send Message to {emailModal.recipient.fullName}</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={5}
              placeholder="Enter your message..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={handleCloseEmailModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSendEmail}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationTable;
