import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  picture: { type: String, required: true },  // Store the URL string
});

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    customerName: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    contact: { type: String, required: true },
    picture: { type: String, required: true },  // Store the image URL
    gallery: { type: [GalleryItemSchema], required: true },  // Array of gallery items
  },
  { timestamps: true }  // Auto-generate createdAt and updatedAt fields
);

export default mongoose.models.News || mongoose.model("News", NewsSchema);
