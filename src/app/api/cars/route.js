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

    // Check if the image is valid
    if (!image || typeof image.arrayBuffer !== "function") {
      console.error("Image is missing or invalid.");
      return NextResponse.json(
        { success: false, msg: "Image file is missing or invalid" },
        { status: 400 }
      );
    }

    // Define the upload directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure the directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Error creating upload directory:", mkdirError.message);
      return NextResponse.json(
        { success: false, msg: "Error creating upload directory" },
        { status: 500 }
      );
    }

    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const filename = `${timestamp}_${image.name}`;
    const filePath = path.join(uploadsDir, filename);

    // Try writing the file to the system
    try {
      await writeFile(filePath, buffer);
    } catch (writeError) {
      console.error("Error writing image file:", writeError.message);
      return NextResponse.json(
        { success: false, msg: "Error saving image file" },
        { status: 500 }
      );
    }

    const CarData = {
      name: formData.get("name")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      seats: formData.get("seats")?.toString() || "",
      picture: `/uploads/${filename}`,  
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
    try {
      await CarsModel.create(CarData);
    } catch (dbError) {
      console.error("Error saving car data to database:", dbError.message);
      return NextResponse.json(
        { success: false, msg: "Error saving car data" },
        { status: 500 }
      );
    }

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

export async function PUT(request) {
  try {
    await ConnectDB(); // Ensure DB connection

    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Car ID is required" },
        { status: 400 }
      );
    }

    // Collect the updates for the car
    const updates = {
      name: formData.get("name"),
      brand: formData.get("brand"),
      seats: formData.get("seats"),
      description: formData.get("description"),
    };

    // Handle image upload if a new image is provided
    const image = formData.get("picture");
    if (image && typeof image.arrayBuffer === "function") {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      // Log to debug image processing
      console.log("Uploading image:", image.name);

      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}_${image.name}`;
      const filePath = path.join(uploadsDir, filename);

      // Attempt to write the image to the file system
      try {
        await writeFile(filePath, imageBuffer);
        updates.picture = `/uploads/${filename}`;
      } catch (writeError) {
        console.error("Error writing image file:", writeError.message);
        return NextResponse.json(
          { success: false, msg: "Error saving image file" },
          { status: 500 }
        );
      }
    }

    // Find and update the car in the database
    const updatedCar = await CarsModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    // Check if the car was found and updated
    if (!updatedCar) {
      return NextResponse.json(
        { success: false, msg: "Car not found" },
        { status: 404 }
      );
    }

    // Return the success response
    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error) {
    console.error("Error in PUT /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
