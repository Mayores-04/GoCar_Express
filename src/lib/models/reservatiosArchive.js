import mongoose from "mongoose";

const ReservationSchema = {
  _id: ObjectId,  
  service: String,
  renterInfo: {
    fullName: String,
    phoneNumber: String,
    email: String
  },
  ownDriverInfo: {
    fullName: String,
    licenseNumber: String,
    phoneNumber: String
  },
  numberOfPassengers: Number,
  pickupLocation: String,
  passengerDetails: [
    {
      fullName: String,
      dateOfBirth: String,
      relationship: String,
      authorizedDriver: Boolean,
      driverLicense: String   
    }
  ],
  additionalDetails: {
    timeTravelDuration: String
  }
};


const ReservationArchiveModel = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);

export default ReservationArchiveModel;