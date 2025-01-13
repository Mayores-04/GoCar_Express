import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: String,
  customerName: String,
  description: String,
  date: Date,
  location: String,
  duration: String,
  contact: String,
  main_picture: String,
  gallery: [
    {
      title: String,
      date: Date,
      gallery_picture: String,
    },
  ],
});

const NewsModel = mongoose.models.News || mongoose.model("News", NewsSchema);
export default NewsModel;
