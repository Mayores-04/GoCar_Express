import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import NewsModel from "@/lib/models/NewsModel";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
export async function POST(req) {
  try {
    const formData = await req.formData();
    console.log("FormData received:", Array.from(formData.entries()));

    const title = formData.get("title");
    const customerName = formData.get("customerName");
    const description = formData.get("description");
    const date = formData.get("date");
    const location = formData.get("location");
    const duration = formData.get("duration");
    const contact = formData.get("contact");
    const image = formData.get("main_picture");

    if (!image) {
      return NextResponse.json({ msg: "Main image is required" }, { status: 400 });
    }

    // Upload the main image to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      ).end(buffer);
    });
    const pictureUrl = uploadResult.secure_url;

    // Process gallery items
    const galleryItems = [];
    for (let i = 0; formData.has(`gallery[${i}][gallery_picture]`); i++) {
      const galleryTitle = formData.get(`gallery[${i}][title]`);
      const galleryDate = formData.get(`gallery[${i}][date]`);
      const galleryImage = formData.get(`gallery[${i}][gallery_picture]`);

      if (galleryTitle && galleryDate && galleryImage) {
        const galleryBuffer = Buffer.from(await galleryImage.arrayBuffer());
        const galleryUploadResult = await new Promise((resolve, reject) => {
          cloudinary.v2.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          ).end(galleryBuffer);
        });
        galleryItems.push({
          title: galleryTitle,
          date: galleryDate,
          picture: galleryUploadResult.secure_url,
        });
      }
    }

    // Save to MongoDB
    await ConnectDB();
    const news = new NewsModel({
      title,
      customerName,
      description,
      date,
      location,
      duration,
      contact,
      picture: pictureUrl,
      gallery: galleryItems,
    });

    await news.save();

    return NextResponse.json({ msg: "News added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving news:", error.message);
    return NextResponse.json({ msg: "Failed to add news", error: error.message }, { status: 500 });
  }
}
export async function PUT(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "News ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const updateData = {};

    // Update basic fields
    if (formData.has("title")) updateData.title = formData.get("title").toString();
    if (formData.has("customerName")) updateData.customerName = formData.get("customerName").toString();
    if (formData.has("description")) updateData.description = formData.get("description").toString();
    if (formData.has("date")) updateData.date = formData.get("date").toString();
    if (formData.has("location")) updateData.location = formData.get("location").toString();
    if (formData.has("duration")) updateData.duration = formData.get("duration").toString();
    if (formData.has("contact")) updateData.contact = formData.get("contact").toString();

    // Handle main picture upload
    if (formData.has("main_picture")) {
      const buffer = Buffer.from(await formData.get("main_picture").arrayBuffer());
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(buffer);
      });
      updateData.picture = uploadResult.secure_url;
    }

    // Process gallery updates
    if (formData.has("gallery")) {
      const updatedGallery = [];
      for (let i = 0; formData.has(`gallery[${i}][gallery_picture]`); i++) {
        const galleryTitle = formData.get(`gallery[${i}][title]`);
        const galleryDate = formData.get(`gallery[${i}][date]`);
        const galleryImage = formData.get(`gallery[${i}][gallery_picture]`);
        if (galleryTitle && galleryDate && galleryImage) {
          const galleryBuffer = Buffer.from(await galleryImage.arrayBuffer());
          const galleryUploadResult = await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream(
              { resource_type: "auto" },
              (error, result) => {
                if (error) reject(error);
                resolve(result);
              }
            ).end(galleryBuffer);
          });

          updatedGallery.push({
            title: galleryTitle,
            date: galleryDate,
            picture: galleryUploadResult.secure_url,
          });
        }
      }
      updateData.gallery = updatedGallery;
    }

    const updatedNews = await NewsModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNews) {
      return NextResponse.json(
        { success: false, msg: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, news: updatedNews });
  } catch (error) {
    console.error("Error in PUT /api/news:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ConnectDB();

    const news = await NewsModel.find();
    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error("Error in GET /api/news:", error.message);
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
        { success: false, msg: "News ID is required" },
        { status: 400 }
      );
    }

    const result = await NewsModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, msg: "News deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/news:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
