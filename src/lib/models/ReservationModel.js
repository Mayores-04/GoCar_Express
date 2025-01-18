import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  car: { type: String, required: true },
  service: { type: String, required: true },
  rentalDuration: { type: Number, required: true },
  ownDriverInfo: {
    fullName: { type: String },
    licenseNumber: { type: String },
    phoneNumber: { type: String },
  },
  renterInfo: {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },  // Ensure this is a Date object
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    driverLicense: { type: String, required: true },
  },
  numberOfPassengers: { type: Number, required: true },
  passengerDetails: [
    {
      fullName: { type: String, required: true },
      dateOfBirth: { type: Date, required: true },  // Ensure this is a Date object
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
  pickupLocation: { type: String }, // Optional, will be set based on the service type
});

// Pre-save middleware to adjust data before saving
ReservationSchema.pre("save", function(next) {
  // If the service is "With Driver", ensure pickupLocation is set or defaulted
  if (this.service === "With Driver" && !this.pickupLocation) {
    this.pickupLocation = "Default Pickup Location";  // Set a default value if pickupLocation is not provided
  } else if (this.service === "Without Driver") {
    // Nullify ownDriverInfo if service is "Without Driver"
    this.ownDriverInfo = null;
  }
  next();
});

const ReservationModel = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);

export default ReservationModel;
