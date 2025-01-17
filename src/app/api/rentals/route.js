import { NextResponse } from 'next/server';
import ConnectDB from "@/lib/config/db";
import RentalActivityModel from "@/lib/models/RentalActivityModel";
import CarsModel from "@/lib/models/CarsModel";   
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await ConnectDB();

    const { carId, userId, rentalDate, returnDate, totalAmount } = await request.json();

    if (!carId || !userId || !rentalDate || !returnDate || !totalAmount) {
      return NextResponse.json({ success: false, msg: "Missing required rental details" }, { status: 400 });
    }

    const rental = new RentalActivityModel({
      carId: carId,   
      userId: userId,   
      rentalDate: new Date(rentalDate),
      returnDate: new Date(returnDate),
      totalAmount,
    });

    await rental.save();

    const now = new Date();
    const isCarCurrentlyRented = await RentalActivityModel.findOne({
      carId: carId,
      returnDate: { $gte: now }  
    });


    if (isCarCurrentlyRented) {
      await CarsModel.findByIdAndUpdate(carId, { carstatus: "On Service" });
    }

    return NextResponse.json({ success: true, msg: "Rental created", rental });
  } catch (error) {
    console.error("Error in POST /api/rentals:", error.message);
    return NextResponse.json({ success: false, msg: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await ConnectDB();

    const rentals = await RentalActivityModel.find();

    return NextResponse.json({ success: true, rentals });
  } catch (error) {
    console.error("Error in GET /api/rentals:", error.message);
    return NextResponse.json({ success: false, msg: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, msg: "Rental ID is required" }, { status: 400 });
    }

    const rental = await RentalActivityModel.findById(id);

    if (!rental) {
      return NextResponse.json({ success: false, msg: "Rental not found" }, { status: 404 });
    }

    await CarsModel.findByIdAndUpdate(rental.carId, { carstatus: "Available" });

    const result = await RentalActivityModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, msg: "Rental not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, msg: "Rental deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/rentals:", error.message);
    return NextResponse.json({ success: false, msg: "Internal server error" }, { status: 500 });
  }
}
