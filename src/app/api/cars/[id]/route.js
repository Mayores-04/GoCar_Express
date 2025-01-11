import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import CarsModel from "@/lib/models/CarsModel";
import { writeFile, mkdir } from "fs/promises";
import path from "path";


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
  