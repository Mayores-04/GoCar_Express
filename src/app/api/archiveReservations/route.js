import { NextResponse } from "next/server";
import mongoose from "mongoose";
import ConnectDB from "@/lib/config/db";
import ReservationArchiveModel from "@/lib/models/reservationArchive";
import ReservationModel from "@/lib/models/ReservationModel";

export async function POST(req) {
  try {
    // Connect to the database
    await ConnectDB();

    // Parse the request body
    const { reservationId, archivedData } = await req.json();

    // Validate reservation ID
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      return NextResponse.json(
        { success: false, message: "Invalid reservation ID" },
        { status: 400 }
      );
    }

    // Check if the reservation exists
    const existingReservation = await ReservationModel.findById(reservationId);

    if (!existingReservation) {
      return NextResponse.json(
        { success: false, message: "Reservation not found" },
        { status: 404 }
      );
    }

    // Prepare the data to archive
    const archiveData = archivedData || existingReservation.toObject();

    // Save to the archive collection
    const archivedReservation = new ReservationArchiveModel(archiveData);
    await archivedReservation.save();

    // Delete from the original reservations collection
    await ReservationModel.findByIdAndDelete(reservationId);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Reservation archived and deleted successfully",
      archivedReservation,
    });
  } catch (error) {
    console.error("Error archiving reservation:", error);

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while processing the request.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
