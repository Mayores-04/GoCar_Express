import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import CarsModel from "@/lib/models/CarsModel";
import cloudinary from "cloudinary";

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
      cloudinary.v2.uploader
        .upload_stream({ resource_type: "auto" }, (error, uploadResult) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadResult);
          }
        })
        .end(buffer);
    });

    console.log("FormData:", {
      name: formData.get("name"),
      brand: formData.get("brand"),
      seats: formData.get("seats"),
      price: formData.get("price"),
      carstatus: formData.get("carstatus"),
      description: formData.get("description"),
    });

    console.log("Cloudinary Upload Result:", result);

    const CarData = {
      name: formData.get("name")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      seats: parseInt(formData.get("seats")?.toString() || "0"),
      price: parseFloat(formData.get("price")?.toString() || "0"),
      picture: result.secure_url, // URL from Cloudinary
      carstatus: formData.get("carstatus")?.toString() || "",
      description: formData.get("description")?.toString() || "",
    };

    console.log(CarData);
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
    
    // Calculate totals
    const totalCars = cars.length;
    const carsNotAvailable = cars.filter(
      (car) => car.carstatus === "Not Available"
    ).length;
    const totalCarsAvailable = cars.filter(
      (car) => car.carstatus === "Available"
    ).length;
    const totalCarsOnService = cars.filter(
      (car) => car.carstatus === "On Service"
    ).length;

    console.log(totalCarsAvailable);
    return NextResponse.json({
      success: true,
      cars,
      totalCars,
      carsNotAvailable,
      totalCarsAvailable,
      totalCarsOnService
    });
    // return NextResponse.json({ cars });
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

    return NextResponse.json({
      success: true,
      msg: "Car deleted successfully",
    });
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
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Car ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const updateData = {};

    // Map form data to updateData fields
    if (formData.has("carstatus")) {
      updateData.carstatus = formData.get("carstatus").toString();
    }
    if (formData.has("name")) {
      updateData.name = formData.get("name").toString();
    }
    if (formData.has("brand")) {
      updateData.brand = formData.get("brand").toString();
    }
    if (formData.has("seats")) {
      const seats = parseInt(formData.get("seats").toString());
      if (isNaN(seats)) {
        return NextResponse.json(
          { success: false, msg: "Invalid seats value" },
          { status: 400 }
        );
      }
      updateData.seats = seats;
    }
    if (formData.has("price")) {
      const price = parseFloat(formData.get("price").toString());
      if (isNaN(price)) {
        return NextResponse.json(
          { success: false, msg: "Invalid price value" },
          { status: 400 }
        );
      }
      updateData.price = price;
    }
    if (formData.has("description")) {
      updateData.description = formData.get("description").toString();
    }

    // Handle image upload if a new image is provided
    if (formData.has("picture")) {
      const image = formData.get("picture");
      if (!image || typeof image.arrayBuffer !== "function") {
        return NextResponse.json(
          { success: false, msg: "Invalid image file" },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream({ resource_type: "auto" }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          })
          .end(buffer);
      });
      updateData.picture = uploadResult.secure_url;
    }

    // Update car in the database
    const updatedCar = await CarsModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCar) {
      return NextResponse.json(
        { success: false, msg: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, car: updatedCar });
  } catch (error) {
    console.error("Error in PUT /api/cars:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
