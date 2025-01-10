import mongoose from "mongoose";

const CarsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  seats: { type: Number, required: true },
  picture: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.cars || mongoose.model("cars", CarsSchema);
