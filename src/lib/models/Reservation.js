import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    car: {type: String, required: true},
    service: {type: String, required: true},
    rentalDuration: {type: Number, required: true},
    ownDriverInfo: {
        fullName: {type: String, required: true},
        licenseNumber: {type: String, required: true},
        phoneNumber: {type: String, required: true},
    },
    renterInfo: {
        fullName: {type: String, required: true},
        dateOfBirth: {type: String, required: true},
        address: {type: String, required: true},
        phoneNumber: {type: String, required: true},
        email: {type: String, required: true},
        driverLicense: {type: String, required: true},
    },
    numberOfPassengers: {type: Number, required: true},
    passengerDetails: [
        {
            fullName: {type: String, required: true},
            dateOfBirth: {type: String, required: true},
            relationship: {type: String, required: true},
            authorizedDriver: {type: Boolean, required: true},
            driverLicense: {type: String, required: true},
        }
    ],
    additionalDetails: {
        timeTravelDuration: {type: String, required: true},
    },
    pickupLocation: {type: String, required: true},
}); 

const ReservationModel = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
export default ReservationModel