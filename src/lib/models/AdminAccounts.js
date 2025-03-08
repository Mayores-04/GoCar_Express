import mongoose from "mongoose";

const AdminAccountSchema = new mongoose.Schema(
    {
        AdminUser: { type: String, required: true},
        Password: { type: String, required: true},
        Status: { type: String, required: true}
    }
);

export default mongoose.models.AdminAccounts || mongoose.model("AdminAccounts", AdminAccountSchema);