"use client";

import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { toast } from "react-toastify";
import EmailApprovalSender from "@/app/emails/EmailApprovalSender";
import EmailCancellationSender from "@/app/emails/EmailCancellationSender";
import axios from "axios";
import useActivities from "@/lib/hooks/useActivities";

interface RenterInfo {
  _id: string;
  fullName: string;
  phoneNumber: string;
  driverLicense: string;
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

interface CarDetails {
  carId: string;
  carName: string;
}

interface Reservation {
  _id: string;
  status: string;
  car: CarDetails;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
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
  const [buttonStates, setButtonStates] = useState<
    Record<string, { disabled: boolean; text: string }>
  >({});

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reservations");
      const data = await response.json();
      if (data.success) {
        setReservations(data.reservations);
        setFilteredReservations(data.reservations);

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

        setLoading(false);
        setButtonStates(initialButtonStates);
      } else {
        console.error("Failed to fetch reservations:", data.msg);
      }

       // Fetch Recent Activities
       const activitiesResponse = await axios.get("/api/activities");
       if (activitiesResponse.data.success) {
         fetchActivities(); // Fetch activities using the hook
       } else {
         toast.error("Failed to fetch activities data.");
       }
    } catch (error) {
      console.error("Error fetching reservations:", error);

      setLoading(false);
    }
  };

  
  const { activities, addActivity, fetchActivities } = useActivities();

  const [currentStatus, setCurrentStatus] = useState<string>("All");
  const [currentService, setCurrentService] = useState<string>("All");

  const combinedFilter = (status: string, service: string) => {
    return reservations.filter((reservation) => {
      const statusMatch = status === "All" || reservation.status === status;
      const serviceMatch = service === "All" || reservation.service === service;
      return statusMatch && serviceMatch;
    });
  };

  const filterReservations = (status: string) => {
    setCurrentStatus(status);
    setFilteredReservations(combinedFilter(status, currentService));
  };

  const filterServices = (service: string) => {
    setCurrentService(service);
    setFilteredReservations(combinedFilter(currentStatus, service));
  };

  const toggleDetails = (reservationId: string) => {
    setExpandedReservationId((prevId) =>
      prevId === reservationId ? null : reservationId
    );
  };

  const handleApprove = async (reservation: Reservation) => {
    setLoading(true);
    try {
      const { renterInfo } = reservation;

      if (!renterInfo) {
        toast.error("No renter information available.");
        return;
      }

      const response = await fetch(`/api/reservations?id=${reservation._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(`Failed to approve reservation: ${data.msg}`);
        return;
      }

      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <EmailApprovalSender userFirstName={renterInfo.fullName} />
      );

      const emailResponse = await fetch("/api/email", {
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

      const emailData = await emailResponse.json();

      if (!emailResponse.ok || !emailData.success) {
        toast.error(`Failed to send approval email: ${emailData.message}`);
        return;
      }

      toast.success(
        `Reservation approved and email sent to ${renterInfo.fullName}.`
      );

      addActivity("Approved reservation")
      setButtonStates((prev) => ({
        ...prev,
        [reservation._id]: { disabled: true, text: "Approved" },
      }));

      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservation._id ? { ...r, status: "Approved" } : r
        )
      );

      setLoading(false);
    } catch (error) {
      console.error("Error approving reservation:", error);
      toast.error("Failed to approve reservation.");

      setLoading(false);
    }
  };

  const handleCancel = async (reservation: Reservation) => {
    const { renterInfo } = reservation;
    setLoading(true);
    try {
      if (!renterInfo) {
        toast.error("No renter information available.");
        return;
      }

      const cancellationReason =
        "The car is not available at the requested time.";

      const response = await fetch(`/api/reservations?id=${reservation._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Cancelled",
          cancellationReason,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(`Failed to cancel reservation: ${data.msg}`);
        return;
      }

      const htmlContent = ReactDOMServer.renderToStaticMarkup(
        <EmailCancellationSender
          userFirstName={renterInfo.fullName}
          cancellationReason={cancellationReason}
        />
      );

      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: renterInfo.email,
          subject: "Reservation Cancelled",
          htmlContent,
        }),
      });

      const emailData = await emailResponse.json();

      if (!emailResponse.ok || !emailData.success) {
        toast.error(`Failed to send cancellation email: ${emailData.message}`);
        return;
      }

      toast.success(
        `Reservation cancelled and email sent to ${renterInfo.fullName}.`
      );

      addActivity("Cancel reservation");

      setButtonStates((prev) => ({
        ...prev,
        [reservation._id]: { disabled: true, text: "Cancelled Reservation" },
      }));

      setReservations((prev) =>
        prev.map((r) =>
          r._id === reservation._id ? { ...r, status: "Cancelled" } : r
        )
      );

      setLoading(false);
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("An error occurred while cancelling the reservation.");

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex space-x-4 mb-4">
        <h2 className="text-2xl font-bold mb-4">
          Viewing {currentStatus} Reservations
        </h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => filterReservations("All")}
            className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            All
          </button>
          <button
            onClick={() => filterReservations("Pending")}
            className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
          >
            Show Pending
          </button>
          <button
            onClick={() => filterReservations("Approved")}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
          >
            Show Approved
          </button>
          <button
            onClick={() => filterReservations("Cancelled")}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
          >
            Show Cancelled
          </button>
        </div>
      </div>
      <div className="flex">
        <select
          onChange={(e) => filterServices(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="With Driver">With Driver</option>
          <option value="Without Driver">Without Driver</option>
        </select>
      </div>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-600">#</th>
            <th className="px-4 py-2 text-left text-gray-600">Service</th>
            <th className="px-4 py-2 text-left text-gray-600">Renter Name</th>
            <th className="px-4 py-2 text-left text-gray-600">Email</th>
            <th className="px-4 py-2 text-left text-gray-600">Contact #</th>
            <th className="px-4 py-2 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation, index) => (
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
                <td className="border px-4 py-2">
                  {reservation.renterInfo.phoneNumber}
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
                    onClick={() => handleApprove(reservation)}
                    disabled={reservation.status === "Approved"}
                    className={`btn ${reservation.status === "Approved" ? "btn-disabled text-gray-400" : "btn-primary hover:underline text-green-500"}`}
                  >
                    {reservation.status === "Approved" ? "Approved" : "Approve"}
                  </button>
                  <button
                    onClick={() => handleCancel(reservation)}
                    disabled={reservation.status === "Cancelled"}
                    className={`btn ${reservation.status === "Cancelled" ? "btn-disabled text-gray-400" : "btn-primary hover:underline text-red-500"}`}
                  >
                    {reservation.status === "Cancelled"
                      ? "Cancelled Reservation"
                      : "Cancel Reservation"}
                  </button>
                </td>
              </tr>
              {expandedReservationId === reservation._id && (
                <tr>
                  <td colSpan={6} className="border px-4 py-2">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">Details</h3>
                      <div>
                        <strong>Car Details:</strong>
                        <p>Car Name: {reservation.car.carName}</p>
                        <p>Car Id: {reservation.car.carId}</p>
                      </div>
                      <div>
                        <strong>Pickup Location:</strong>
                        <p>Location: {reservation.pickupLocation}</p>
                      </div>
                      <div>
                        <strong>Renter Information:</strong>
                        <p>Full Name: {reservation.renterInfo.fullName}</p>
                        <p>
                          Phone Number: {reservation.renterInfo.phoneNumber}
                        </p>
                        <p>Email: {reservation.renterInfo.email}</p>
                        <p>
                          Driver License: {reservation.renterInfo.driverLicense}
                        </p>
                      </div>
                      <div>
                        <strong>Driver Information:</strong>
                        <p>Full Name: {reservation.ownDriverInfo.fullName}</p>
                        <p>
                          License Number:{" "}
                          {reservation.ownDriverInfo.licenseNumber}
                        </p>
                        <p>
                          Phone Number: {reservation.ownDriverInfo.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <strong>Passenger Details:</strong>
                        {reservation.passengerDetails.length === 0 ? (
                          <p>No passengers listed.</p>
                        ) : (
                          reservation.passengerDetails.map(
                            (passenger, index) => (
                              <div key={index} className="ml-4">
                                <p>Full Name: {passenger.fullName}</p>
                                <p>Date of Birth: {passenger.dateOfBirth}</p>
                                <p>Relationship: {passenger.relationship}</p>
                                <p>
                                  Authorized Driver:{" "}
                                  {passenger.authorizedDriver ? "Yes" : "No"}
                                </p>
                                {passenger.driverLicense && (
                                  <p>
                                    Driver License: {passenger.driverLicense}
                                  </p>
                                )}
                              </div>
                            )
                          )
                        )}
                      </div>
                      <div>
                        <strong>Additional Details:</strong>
                        <p>
                          Time Travel Duration:{" "}
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
    </div>
  );
};

export default ReservationTable;
