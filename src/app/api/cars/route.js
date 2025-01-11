import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import CarsModel from "@/lib/models/CarsModel";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function POST(request) {
  try {
    await ConnectDB();  

    const formData = await request.formData();
    const timestamp = Date.now();
    const image = formData.get("picture");

    // Check if the image is valid
    if (!image || typeof image.arrayBuffer !== "function") {
      console.error("Image is missing or invalid.");
      return NextResponse.json(
        { success: false, msg: "Image file is missing or invalid" },
        { status: 400 }
      );
    }

    // Convert the image to a Buffer
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);

    // Upload image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto" }, 
        (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        }
      ).end(buffer);
    });

    // Create the car data
    const CarData = {
      name: formData.get("name")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      seats: formData.get("seats")?.toString() || "",
      picture: result.secure_url,  // URL from Cloudinary
      description: formData.get("description")?.toString() || "",
    };

    // Validate car data fields
    if (!CarData.name || !CarData.brand || !CarData.seats || !CarData.description) {
      return NextResponse.json(
        { success: false, msg: "All fields are required" },
        { status: 400 }
      );
    }

    // Save car data to the database
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
    await ConnectDB();  

    const cars = await CarsModel.find();
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
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Car ID is required" },
        { status: 400 }
      );
    }

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
