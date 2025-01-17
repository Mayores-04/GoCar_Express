// "use client";

// import React, { useState } from "react";

// interface Passenger {
//   fullName: string;
//   dateOfBirth: string;
//   relationship: string;
//   authorizedDriver: string;
//   driverLicense?: string;
// }

// interface RenterInfo {
//   fullName: string;
//   dateOfBirth: string;
//   address: string;
//   phoneNumber: string;
//   email: string;
//   driverLicense: string;
// }

// interface AdditionalDetails {
//   timeTravelDuration: string;
// }

// interface Reservation {
//   _id: string;
//   service: string;
//   renterInfo: RenterInfo;
//   numberOfPassengers: number;
//   pickupLocation: string;
//   passengerDetails: Passenger[];
//   additionalDetails: AdditionalDetails;
// }

// import { reservationData } from "@/app/data/reservationData";

// const ReservationTable: React.FC = () => {
//   const [expandedReservationId, setExpandedReservationId] = useState<
//     string | null
//   >(null);

//   const toggleDetails = (reservationId: string) => {
//     setExpandedReservationId((prevId) =>
//       prevId === reservationId ? null : reservationId
//     );
//   };

//   return (
//     <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
//       <table className="min-w-full table-auto">
//         <thead>
//           <tr>
//             <th className="px-4 py-2 text-left text-gray-600">Reservation #</th>
//             <th className="px-4 py-2 text-left text-gray-600">Service</th>
//             <th className="px-4 py-2 text-left text-gray-600">Renter Name</th>
//             <th className="px-4 py-2 text-left text-gray-600">
//               Number of Passengers
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600">
//               Pickup Location
//             </th>
//             <th className="px-4 py-2 text-left text-gray-600">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {reservationData.map((reservation, index) => (
//             <React.Fragment key={index}>
//               <tr>
//                 <td className="border px-4 py-2">{index + 1}</td>
//                 <td className="border px-4 py-2">{reservation.service}</td>
//                 <td className="border px-4 py-2">
//                   {reservation.renterInfo.fullName}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {reservation.numberOfPassengers}
//                 </td>
//                 <td className="border px-4 py-2">
//                   {reservation.pickupLocation}
//                 </td>
//                 <td className="border px-4 py-2">
//                   <button
//                     onClick={() => toggleDetails(reservation._id)}
//                     className="text-blue-500 hover:underline"
//                   >
//                     {expandedReservationId === reservation._id
//                       ? "Hide Details"
//                       : "View Details"}
//                   </button>
//                 </td>
//               </tr>
//               {expandedReservationId === reservation._id && (
//                 <tr>
//                   <td colSpan={6} className="border px-4 py-2">
//                     <div className="space-y-4">
//                       <h3 className="font-semibold text-gray-800">
//                         Passenger Details
//                       </h3>
//                       {/* Display driver information */}
//                       <div className="border-t pt-2">
//                         <strong>Driver Information:</strong>
//                         <p>
//                           <strong>Driver's Name:</strong>{" "}
//                           {reservation.ownDriverInfo.fullName}
//                         </p>
//                         <p>
//                           <strong>License Number:</strong>{" "}
//                           {reservation.ownDriverInfo.licenseNumber}
//                         </p>
//                         <p>
//                           <strong>Phone Number:</strong>{" "}
//                           {reservation.ownDriverInfo.phoneNumber}
//                         </p>
//                       </div>
                      
//                       {/* Displaying passenger details */}
//                       {reservation.passengerDetails.map(
//                         (passenger, passengerIndex) => (
//                           <div key={passengerIndex} className="border-t pt-2">
//                             <p>
//                               <strong>Passenger {passengerIndex + 1}:</strong>
//                             </p>
//                             <p>
//                               <strong>Full Name:</strong> {passenger.fullName}
//                             </p>
//                             <p>
//                               <strong>Date of Birth:</strong>{" "}
//                               {passenger.dateOfBirth}
//                             </p>
//                             <p>
//                               <strong>Relationship to Renter:</strong>{" "}
//                               {passenger.relationship}
//                             </p>
//                             <p>
//                               <strong>Authorized Driver:</strong>{" "}
//                               {passenger.authorizedDriver}
//                             </p>
//                             {passenger.authorizedDriver === "Yes" && (
//                               <p>
//                                 <strong>Driver's License:</strong>{" "}
//                                 {passenger.driverLicense}
//                               </p>
//                             )}
//                           </div>
//                         )
//                       )}

//                       {/* Display additional details */}
//                       <div className="border-t pt-2">
//                         <strong>Additional Details:</strong>
//                         <p>
//                           <strong>Time/Travel Duration:</strong>{" "}
//                           {reservation.additionalDetails.timeTravelDuration}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ReservationTable;
