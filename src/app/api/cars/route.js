import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import CarsModel from "@/lib/models/CarsModel";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    await ConnectDB(); // Establish DB connection

    const formData = await request.formData();
    const timestamp = Date.now();

    // Handle image file
    const image = formData.get("picture");
    if (!image || typeof image.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, msg: "Image file is missing or invalid" },
        { status: 400 }
      );
    }

    // Define the uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the uploads directory exists
    await mkdir(uploadsDir, { recursive: true });

    // Save image to public/uploads folder
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const filename = `${timestamp}_${image.name}`;
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Prepare car data
    const CarData = {
      name: formData.get("name")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      seats: formData.get("seats")?.toString() || "",
      picture: `/uploads/${filename}`, // Adjusted the path for accessibility
      description: formData.get("description")?.toString() || "",
    };

    // Validate required fields
    if (!CarData.name || !CarData.brand || !CarData.seats || !CarData.description) {
      return NextResponse.json(
        { success: false, msg: "All fields are required" },
        { status: 400 }
      );
    }

    // Save car data to database
    await CarsModel.create(CarData);

    return NextResponse.json({ success: true, msg: "Car added successfully" });
  } catch (error) {
    console.error("Error in POST /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("Fetching cars...");

    await ConnectDB(); // Ensure DB connection

    // Retrieve all cars from the database
    const cars = await CarsModel.find();
    console.log("Fetched Cars:", cars);

    // Return the list of cars as a response
    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Error in GET /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
