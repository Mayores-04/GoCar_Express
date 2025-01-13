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


export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const image = formData.get("picture");

    // Validate required fields
    const requiredFields = [
      "title",
      "customerName",
      "description",
      "date",
      "location",
      "duration",
      "contact",
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { success: false, msg: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Handle image upload
    let imageUrl = "";
    if (image && typeof image.arrayBuffer === "function") {
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
      imageUrl = uploadResult.secure_url;
    }

    // Handling the gallery data
    const galleryField = formData.get("gallery");
    let gallery = [];
    if (galleryField) {
      for (let i = 0; i < 10; i++) {
        const title = formData.get(`gallery[${i}][title]`);
        const date = formData.get(`gallery[${i}][date]`);
        const picture = formData.get(`gallery[${i}][picture]`);

        console.log("Gallery Item", { title, date, picture }); // Log the gallery item

        if (title || date || picture) {
          let galleryItem = {
            title: title || "",
            date: date || "",
            picture: null,
          };

          if (picture) {
            try {
              console.log("Uploading picture", picture); // Log the picture being uploaded
              const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.v2.uploader.upload_stream(
                  { resource_type: "auto" },
                  (error, result) => {
                    if (error) reject(error);
                    resolve(result);
                  }
                ).end(picture.stream()); // Ensure stream is passed here
              });
              galleryItem.picture = uploadResult.secure_url;
            } catch (error) {
              console.error("Error uploading picture:", error.message);
            }
          }

          gallery.push(galleryItem);
        }
      }
    }

    // Construct the news data object
    const newsData = {
      title: formData.get("title").toString(),
      customerName: formData.get("customerName").toString(),
      description: formData.get("description").toString(),
      date: formData.get("date").toString(),
      location: formData.get("location").toString(),
      duration: formData.get("duration").toString(),
      contact: formData.get("contact").toString(),
      picture: imageUrl,
      gallery, // Ensure gallery is included here
    };

    // Save to the database
    const createdNews = await NewsModel.create(newsData);

    return NextResponse.json({ success: true, news: createdNews });
  } catch (error) {
    console.error("Error in POST /api/news:", error.message);
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
        { success: false, msg: "News ID is required" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const updateData = {};

    // Collect fields for update
    if (formData.has("title")) updateData.title = formData.get("title").toString();
    if (formData.has("customerName")) updateData.customerName = formData.get("customerName").toString();
    if (formData.has("description")) updateData.description = formData.get("description").toString();
    if (formData.has("date")) updateData.date = formData.get("date").toString();
    if (formData.has("location")) updateData.location = formData.get("location").toString();
    if (formData.has("duration")) updateData.duration = formData.get("duration").toString();
    if (formData.has("contact")) updateData.contact = formData.get("contact").toString();

    // Update gallery if provided
    if (formData.has("gallery")) {
      try {
        updateData.gallery = JSON.parse(formData.get("gallery").toString());
        if (!Array.isArray(updateData.gallery)) {
          throw new Error("Gallery must be an array.");
        }
      } catch (error) {
        return NextResponse.json(
          { success: false, msg: "Invalid gallery format. It should be valid JSON." },
          { status: 400 }
        );
      }
    }

    // Handle picture upload
    if (formData.has("picture")) {
      const buffer = Buffer.from(await formData.get("picture").arrayBuffer());
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
