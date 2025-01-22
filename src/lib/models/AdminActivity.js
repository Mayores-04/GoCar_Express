import mongoose from "mongoose";
const AdminActivitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    time: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.models.AdminActivity ||
  mongoose.model("AdminActivity", AdminActivitySchema);
