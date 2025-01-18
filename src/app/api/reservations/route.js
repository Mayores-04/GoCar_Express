import { NextResponse } from 'next/server';
import ConnectDB from "@/lib/config/db";
import ReservationModel from "@/lib/models/ReservationModel";
import { toast } from 'react-toastify';

export async function POST(request) {
  try {
    await ConnectDB();

    // Parse the JSON body from the request
    const formData = await request.json();

    // Log the raw data from the client for debugging
    console.log("Received reservation data:", formData);

    // Ensure `authorizedDriver` is a boolean
    const transformedPassengerDetails = formData.passengerDetails.map((passenger) => ({
      ...passenger,
      authorizedDriver: passenger.authorizedDriver === "Yes", // Convert to boolean (true/false)
    }));

    // Convert `pickupLocation` to a string if it's an array
    const pickupLocation =
      Array.isArray(formData.pickupLocation) ? formData.pickupLocation.join(",") : formData.pickupLocation;

    // Structure reservationData
    const reservationData = {
      car: "6789f3819dc5bed2f7e8f0ec" || "",  // Example car ID; replace with dynamic value if needed
      service: formData.service || "",
      rentalDuration: parseInt(formData.rentalDuration || "0", 10),
      ownDriverInfo: formData.service === "Without Driver" ? null : {
        fullName: formData.ownDriverInfo?.fullName || "",
        licenseNumber: formData.ownDriverInfo?.licenseNumber || "",
        phoneNumber: formData.ownDriverInfo?.phoneNumber || "",
      },
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
      pickupLocation: pickupLocation,  // Ensure it's a string
    };

    // Log the structured data for debugging
    
    console.log("Structured reservation data:", reservationData);

    const newReservation = await ReservationModel.create(reservationData);

    return NextResponse.json({ msg: "Reservation added successfully", reservation: newReservation }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Failed to add reservation", error: error.message },
      { status: 500 }
    );
  }
}

// Handle GET request to fetch all reservations
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

// Handle PUT request to update a reservation
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

    const formData = await request.formData();

    const updateData = {
      ...(formData.has("car") && { car: formData.get("car").toString() }),
      ...(formData.has("service") && { service: formData.get("service").toString() }),
      ...(formData.has("rentalDuration") && {
        rentalDuration: parseInt(formData.get("rentalDuration").toString(), 10),
      }),
      ...(formData.has("ownDriverInfo") && {
        ownDriverInfo: {
          fullName: formData.get("ownDriverInfo.fullName").toString(),
          licenseNumber: formData.get("ownDriverInfo.licenseNumber").toString(),
          phoneNumber: formData.get("ownDriverInfo.phoneNumber").toString(),
        },
      }),
      ...(formData.has("renterInfo") && {
        renterInfo: {
          fullName: formData.get("renterInfo.fullName").toString(),
          dateOfBirth: formData.get("renterInfo.dateOfBirth").toString(),
          address: formData.get("renterInfo.address").toString(),
          phoneNumber: formData.get("renterInfo.phoneNumber").toString(),
          email: formData.get("renterInfo.email").toString(),
          driverLicense: formData.get("renterInfo.driverLicense").toString(),
        },
      }),
      ...(formData.has("numberOfPassengers") && {
        numberOfPassengers: parseInt(formData.get("numberOfPassengers").toString(), 10),
      }),
      ...(formData.has("passengerDetails") && {
        passengerDetails: JSON.parse(formData.get("passengerDetails")),
      }),
      ...(formData.has("additionalDetails") && {
        additionalDetails: JSON.parse(formData.get("additionalDetails")),
      }),
      ...(formData.has("pickupLocation") && {
        pickupLocation: formData.get("pickupLocation").toString(),
      }),
    };

    // Validate service-specific logic
    if (updateData.service === "With Driver" && !updateData.pickupLocation) {
      return NextResponse.json(
        { success: false, msg: "Pickup location is required for service 'With Driver'." },
        { status: 400 }
      );
    }

    if (updateData.service === "Without Driver" && updateData.ownDriverInfo) {
      updateData.ownDriverInfo = null;  // Remove ownDriverInfo if the service is "Without Driver"
    }

    const updatedReservation = await ReservationModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedReservation) {
      return NextResponse.json(
        { success: false, msg: "Reservation not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reservation: updatedReservation });
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

    return NextResponse.json({ success: true, msg: "Reservation deleted successfully." });
  } catch (error) {
    console.error("Error in DELETE /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
