"use client";

import React, { useState, useEffect } from "react";

// Define types for the reservation data
interface RenterInfo {
  fullName: string;
  phoneNumber: string;
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

  // Fetch reservations from the server
  useEffect(() => {
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
    fetchReservations();
  }, []);

  const toggleDetails = (reservationId: string) => {
    setExpandedReservationId((prevId) => (prevId === reservationId ? null : reservationId));
  };

  // Delete a reservation
  const handleDelete = async (reservationId: string) => {
    try {
      const response = await fetch(`/api/reservation?id=${reservationId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation._id !== reservationId)
        );
        alert("Reservation deleted successfully.");
      } else {
        alert("Failed to delete reservation: " + data.msg);
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Error deleting reservation.");
    }
  };

  // Simulate messaging the renter
  const handleMessage = (renterInfo: RenterInfo) => {
    alert(`Messaging ${renterInfo.fullName} (${renterInfo.phoneNumber}).`);
  };

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">Reservation #</th>
            <th className="px-4 py-2 text-left text-gray-600">Service</th>
            <th className="px-4 py-2 text-left text-gray-600">Renter Name</th>
            <th className="px-4 py-2 text-left text-gray-600">Passengers</th>
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
                <td className="border px-4 py-2">{reservation.numberOfPassengers}</td>
                <td className="border px-4 py-2">{reservation.pickupLocation}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleDetails(reservation._id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedReservationId === reservation._id ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    onClick={() => handleMessage(reservation.renterInfo)}
                    className="text-green-500 hover:underline"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => handleDelete(reservation._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {expandedReservationId === reservation._id && (
                <tr>
                  <td colSpan={6} className="border px-4 py-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">Details</h3>
                      {/* Driver Information */}
                      <div>
                        <strong>Driver Information:</strong>
                        <p>Full Name: {reservation.ownDriverInfo.fullName || "N/A"}</p>
                        <p>License: {reservation.ownDriverInfo.licenseNumber || "N/A"}</p>
                        <p>Phone: {reservation.ownDriverInfo.phoneNumber || "N/A"}</p>
                      </div>
                      {/* Passenger Details */}
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
                      {/* Additional Details */}
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
    </div>
  );
};

export default ReservationTable;
