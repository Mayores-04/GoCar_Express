import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import CarsModel from "@/lib/models/CarsModel";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    await ConnectDB();  

    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("picture");
    if (!image || typeof image.arrayBuffer !== "function") {
      return NextResponse.json(
        { success: false, msg: "Image file is missing or invalid" },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const filename = `${timestamp}_${image.name}`;
    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const CarData = {
      name: formData.get("name")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      seats: formData.get("seats")?.toString() || "",
      picture: `/uploads/${filename}`,  
      description: formData.get("description")?.toString() || "",
    };

    if (!CarData.name || !CarData.brand || !CarData.seats || !CarData.description) {
      return NextResponse.json(
        { success: false, msg: "All fields are required" },
        { status: 400 }
      );
    }

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

    await ConnectDB();  

    const cars = await CarsModel.find();
    console.log("Fetched Cars:", cars);

    return NextResponse.json({ cars });
  } catch (error) {
    console.error("Error in GET /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB(); // Ensure the database connection is established.

    // Extract the car ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Car ID is required" },
        { status: 400 }
      );
    }

    // Attempt to delete the car document
    const result = await CarsModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "Car deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}