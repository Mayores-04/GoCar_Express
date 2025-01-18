import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import ReservationModel from "@/lib/models/ReservationModel";

export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();

    const reservationData = {
      car: formData.get("car")?.toString() || "",
      service: formData.get("service")?.toString() || "",
      rentalDuration: parseInt(formData.get("rentalDuration")?.toString() || "0"),
      ownDriverInfo: {
        fullName: formData.get("ownDriverInfo.fullName")?.toString() || "",
        licenseNumber: formData.get("ownDriverInfo.licenseNumber")?.toString() || "",
        phoneNumber: formData.get("ownDriverInfo.phoneNumber")?.toString() || "",
      },
      renterInfo: {
        fullName: formData.get("renterInfo.fullName")?.toString() || "",
        dateOfBirth: formData.get("renterInfo.dateOfBirth")?.toString() || "",
        address: formData.get("renterInfo.address")?.toString() || "",
        phoneNumber: formData.get("renterInfo.phoneNumber")?.toString() || "",
        email: formData.get("renterInfo.email")?.toString() || "",
        driverLicense: formData.get("renterInfo.driverLicense")?.toString() || "",
      },
      numberOfPassengers: parseInt(formData.get("numberOfPassengers")?.toString() || "0"),
      passengerDetails: JSON.parse(formData.get("passengerDetails") || "[]"),
      additionalDetails: {
        timeTravelDuration: formData.get("additionalDetails.timeTravelDuration")?.toString() || "",
      },
      pickupLocation: formData.get("pickupLocation")?.toString() || "",
    };

    console.log(reservationData);
    await ReservationModel.create(reservationData);

    return NextResponse.json({ success: true, msg: "Reservation created successfully" });
  } catch (error) {
    console.error("Error in POST /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
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
    console.error("Error in GET /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Reservation ID is required" },
        { status: 400 }
      );
    }

    const result = await ReservationModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Reservation ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const updateData = {};

    if (formData.has("car")) updateData.car = formData.get("car").toString();
    if (formData.has("service")) updateData.service = formData.get("service").toString();
    if (formData.has("rentalDuration"))
      updateData.rentalDuration = parseInt(formData.get("rentalDuration").toString());
    if (formData.has("ownDriverInfo"))
      updateData.ownDriverInfo = JSON.parse(formData.get("ownDriverInfo"));
    if (formData.has("renterInfo"))
      updateData.renterInfo = JSON.parse(formData.get("renterInfo"));
    if (formData.has("numberOfPassengers"))
      updateData.numberOfPassengers = parseInt(formData.get("numberOfPassengers").toString());
    if (formData.has("passengerDetails"))
      updateData.passengerDetails = JSON.parse(formData.get("passengerDetails"));
    if (formData.has("additionalDetails"))
      updateData.additionalDetails = JSON.parse(formData.get("additionalDetails"));
    if (formData.has("pickupLocation"))
      updateData.pickupLocation = formData.get("pickupLocation").toString();

    const updatedReservation = await ReservationModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedReservation) {
      return NextResponse.json(
        { success: false, msg: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, reservation: updatedReservation });
  } catch (error) {
    console.error("Error in PUT /api/reservation:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
