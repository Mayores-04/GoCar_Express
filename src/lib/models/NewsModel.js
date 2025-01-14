import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customerName: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  contact: { type: String, required: true },
  main_picture: { type: String, required: true },
  gallery: [
    {
      title: { type: String, required: true },
      date: { type: Date, required: true },
      gallery_picture: { type: String, required: true },
    },
  ],
});

const NewsModel = mongoose.models.News || mongoose.model("News", NewsSchema);
export default NewsModel;

