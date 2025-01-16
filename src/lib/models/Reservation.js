import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    ServiceWeOffer: {type: String, required: true},
    FullName: {type: String, required: true},
    DateOfBirth: {type: Date, required: true},
    ResidentialAddress: {type: String, required: true},
    PhoneNumber: {type: Number, required: true},
    EmailAddress: {type: String, required: true},
    DriverLicense: {type: String, required: true},
    NumberOfPassenger: {type: Number, required: true},
    Passenger: [
        {
            PassengerFullName: {type: String, required: true},
            PassengerDataOfBirth: {type: String, required: true},
            PassengerRelationshipToRenter: {type: String, required: true},
            PassengerAuthorizeDriver: {type: String, required: true},
            PassengerDriverLicense: {type: String, required: true},
        }
    ],
    TimeOrTravelDuration: {type: String, required: true},
    PickupLocation: {type: String, required: true},
}); 

const ReservationModel = mongoose.models.Reservation || mongoose.model("Reservation", ReservationModel);
export default ReservationModel