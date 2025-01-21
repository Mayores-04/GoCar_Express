"use client";

import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { useRouter } from "next/router";
import EmailApprovalSender from "@/app/emails/EmailApprovalSender";
import { toast } from "react-toastify";
import EmailCancellationSender from "@/app/emails/EmailCancellationSender";

interface RenterInfo {
  _id: string;
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
  const [expandedReservationId, setExpandedReservationId] = useState<
    string | null
  >(null);
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

        const initialButtonStates = data.reservations.reduce(
          (acc: any, reservation: Reservation) => {
            acc[reservation._id] = {
              disabled: false,
              text: "Cancel Reservation",
            };
            return acc;
          },
          {}
        );
        setButtonStates(initialButtonStates);
      } else {
        console.error("Failed to fetch reservations:", data.msg);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const toggleDetails = (reservationId: string) => {
    setExpandedReservationId((prevId) =>
      prevId === reservationId ? null : reservationId
    );
  };

  const handleApprove = async (reservation: Reservation) => {
    try {
      const { renterInfo } = reservation;

      if (!renterInfo) {
        toast.error("No renter information available.");
        return;
      }

      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <EmailApprovalSender userFirstName={renterInfo.fullName} />
      );

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: renterInfo.email,
          subject: "Reservation Approved",
          htmlContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          `Reservation approved and email sent to ${renterInfo.fullName}`
        );
      } else {
        toast.error(
          `Failed to send email to ${renterInfo.fullName}: ${data.message}`
        );
      }
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error("Failed to approve reservation.");
    }
  };
  const [cancellationModal, setCancellationModal] = useState<{
    show: boolean;
    reservation: Reservation | null;
    reason: string;
  }>({ show: false, reservation: null, reason: "" });
  const [buttonStates, setButtonStates] = useState<
    Record<string, { disabled: boolean; text: string }>
  >({});
  const handleCancelConfirmation = (reservation: Reservation) => {
    setCancellationModal({ show: true, reservation, reason: "" });
  };

  const handleCancel = async () => {
    if (!cancellationModal.reservation) return;
    const { reservation, reason } = cancellationModal;

    try {
      const { renterInfo } = reservation;

      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <EmailCancellationSender
          userFirstName={renterInfo.fullName}
          cancellationReason={reason}
        />
      );

      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: renterInfo._id,
          email: renterInfo.email,
          subject: "Your Reservation Has Been Cancelled",
          htmlContent,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok || !emailData.success) {
        toast.error(
          `Failed to send email to ${renterInfo.fullName}: ${emailData.message}`
        );
        return;
      }

      toast.success(
        `Reservation cancelled. Email sent to ${renterInfo.fullName}.`
      );

      setButtonStates((prev) => ({
        ...prev,
        [reservation._id]: { disabled: true, text: "Cancelled Successfully" },
      }));

      setCancellationModal({ show: false, reservation: null, reason: "" });
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("An error occurred while cancelling the reservation.");
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
            <th className="px-4 py-2 text-left text-gray-600">
              Pickup Location
            </th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <React.Fragment key={reservation._id}>
              <tr>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{reservation.service}</td>
                <td className="border px-4 py-2">
                  {reservation.renterInfo.fullName}
                </td>
                <td className="border px-4 py-2">
                  {reservation.renterInfo.email}
                </td>
                {/* <td className="border px-4 py-2">{reservation.numberOfPassengers}</td> */}
                <td className="border px-4 py-2">
                  {reservation.pickupLocation}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => toggleDetails(reservation._id)}
                    className="text-blue-500 hover:underline"
                  >
                    {expandedReservationId === reservation._id
                      ? "Hide Details"
                      : "View Details"}
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
                    onClick={() => handleCancelConfirmation(reservation)}
                    disabled={buttonStates[reservation._id]?.disabled}
                    className={`btn text-red-500 ${
                      buttonStates[reservation._id]?.disabled
                        ? "btn-disabled text-black"
                        : "btn-primary"
                    }`}
                  >
                    {buttonStates[reservation._id]?.text}
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
                        <p>
                          Full Name:{" "}
                          {reservation.ownDriverInfo.fullName || "N/A"}
                        </p>
                        <p>
                          License:{" "}
                          {reservation.ownDriverInfo.licenseNumber || "N/A"}
                        </p>
                        <p>
                          Phone:{" "}
                          {reservation.ownDriverInfo.phoneNumber || "N/A"}
                        </p>
                      </div>
                      {reservation.passengerDetails.map((passenger, i) => (
                        <div key={i}>
                          <strong>Passenger {i + 1}:</strong>
                          <p>Name: {passenger.fullName}</p>
                          <p>DOB: {passenger.dateOfBirth}</p>
                          <p>Relationship: {passenger.relationship}</p>
                          <p>
                            Authorized Driver:{" "}
                            {passenger.authorizedDriver ? "Yes" : "No"}
                          </p>
                          {passenger.authorizedDriver && (
                            <p>
                              Driver's License:{" "}
                              {passenger.driverLicense || "N/A"}
                            </p>
                          )}
                        </div>
                      ))}
                      <div>
                        <strong>Additional Details:</strong>
                        <p>
                          Time/Travel Duration:{" "}
                          {reservation.additionalDetails.timeTravelDuration}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Cancellation Modal */}
      {cancellationModal.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Cancel Reservation for{" "}
              {cancellationModal.reservation?.renterInfo.fullName}
            </h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={3}
              placeholder="Enter cancellation reason..."
              value={cancellationModal.reason}
              onChange={(e) =>
                setCancellationModal((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                onClick={() =>
                  setCancellationModal({
                    show: false,
                    reservation: null,
                    reason: "",
                  })
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleCancel}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Email Modal */}
      {emailModal.show && emailModal.recipient && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">
              Send Message to {emailModal.recipient.fullName}
            </h3>
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
