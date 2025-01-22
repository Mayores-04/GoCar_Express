import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  status: { type: String, required: true, default: "Pending" },
  car: {
    carId: { type: String, required: true }, 
    carName: { type: String, required: true },  
  },
  service: { type: String, required: true },
  rentalDuration: { type: Number, required: true },
  ownDriverInfo: {
    fullName: { type: String },
    licenseNumber: { type: String },
    phoneNumber: { type: String },
  },
  renterInfo: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },  
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    driverLicense: { type: String, required: true  },
  },
  numberOfPassengers: { type: Number, required: true },
  passengerDetails: [
    {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },   
      relationship: { type: String, required: true },
      authorizedDriver: { type: Boolean, required: true },
      driverLicense: {
        type: String,
        required: function() { return this.authorizedDriver; },
      },
    },
  ],
  additionalDetails: {
    timeTravelDuration: { type: String, required: true },
  },
  pickupLocation: { type: String },  
});

const ReservationModel = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);

export default ReservationModel;
