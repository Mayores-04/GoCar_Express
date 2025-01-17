import mongoose from "mongoose";

const RentalActivitySchema = new mongoose.Schema({
  carId: { type: String, required: true },   
  userId: { type: String, required: true },   
  rentalDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
});

export default mongoose.models.RentalActivity || mongoose.model("RentalActivity", RentalActivitySchema);
