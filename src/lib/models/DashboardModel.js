import mongoose from "mongoose";

const AdminDashboardSchema = new mongoose.Schema({
  revenue: { type: Number, required: true },
  totalCarsRented: { type: Number, required: true },
});

const DashboardModel =
  mongoose.models.AdminDashboard ||
  mongoose.model("AdminDashboard", AdminDashboardSchema);

export default DashboardModel;
