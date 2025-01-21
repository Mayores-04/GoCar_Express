  import { NextResponse } from "next/server";
  import ConnectDB from "@/lib/config/db";
  import ReservationModel from "@/lib/models/ReservationModel";

  export async function POST(request) {
    try {
      await ConnectDB();

      const formData = await request.json();

      console.log("Received reservation data:", formData);

      const transformedPassengerDetails = formData.passengerDetails.map(
        (passenger) => ({
          ...passenger,
          authorizedDriver: passenger.authorizedDriver === "Yes",  
        })
      );

      const pickupLocation = Array.isArray(formData.pickupLocation)
        ? formData.pickupLocation.join(",")
        : formData.pickupLocation;

      // Structure reservationData
      const reservationData = {
        status: "Pending",
        car: "6789f3819dc5bed2f7e8f0ec" || "",  
        service: formData.service || "",
        rentalDuration: parseInt(formData.rentalDuration || "0", 10),
        ownDriverInfo:
        formData.service === "Without Driver"
          ? {
              fullName: formData.ownDriverInfo?.fullName || "",
              licenseNumber: formData.ownDriverInfo?.licenseNumber || "",
              phoneNumber: formData.ownDriverInfo?.phoneNumber || "",
            }
          : { fullName: "", licenseNumber: "", phoneNumber: "" },
        renterInfo: {
          fullName: formData.renterInfo?.fullName || "",
          dateOfBirth: new Date(formData.renterInfo?.dateOfBirth || ""),
          address: formData.renterInfo?.address || "",
          phoneNumber: formData.renterInfo?.phoneNumber || "",
          email: formData.renterInfo?.email || "",
          driverLicense: formData.renterInfo?.driverLicense || "",
        },
        numberOfPassengers: parseInt(formData.numberOfPassengers || "0", 10),
        passengerDetails: transformedPassengerDetails,
        additionalDetails: formData.additionalDetails || {},
        pickupLocation: pickupLocation,  
      };

      console.log("Structured reservation data:", reservationData);

      const newReservation = await ReservationModel.create(reservationData);
      console.log("Saved Reservation:", newReservation);
      return NextResponse.json(
        { msg: "Reservation added successfully", reservation: newReservation },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error in POST /api/reservation:", error.message);
      return NextResponse.json(
        {
          success: false,
          msg: "Failed to add reservation",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }

  export async function GET() {
    try {
      await ConnectDB();

      const reservations = await ReservationModel.find();

      return NextResponse.json({ success: true, reservations });
    } catch (error) {
      console.error("Error in GET /api/reservation:", error);
      return NextResponse.json(
        { success: false, msg: "Internal server error" },
        { status: 500 }
      );
    }
  }

// PUT: Update reservation (including status)
export async function PUT(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Reservation ID is required." },
        { status: 400 }
      );
    }

    const updateData = await request.json();

    if (updateData.status && !["Pending", "Confirmed", "Cancelled"].includes(updateData.status)) {
      return NextResponse.json(
        { success: false, msg: "Invalid status value." },
        { status: 400 }
      );
    }

    const updatedReservation = await ReservationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedReservation) {
      return NextResponse.json(
        { success: false, msg: "Reservation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Error in PUT /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
  // Handle DELETE request to remove a reservation
  export async function DELETE(request) {
    try {
      await ConnectDB();

      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json(
          { success: false, msg: "Reservation ID is required." },
          { status: 400 }
        );
      }

      const result = await ReservationModel.findByIdAndDelete(id);

      if (!result) {
        return NextResponse.json(
          { success: false, msg: "Reservation not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        msg: "Reservation deleted successfully.",
      });
    } catch (error) {
      console.error("Error in DELETE /api/reservation:", error.message);
      return NextResponse.json(
        { success: false, msg: "Internal server error", error: error.message },
        { status: 500 }
      );
    }
  }
