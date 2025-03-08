import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ConnectDB from "@/lib/config/db";
import AdminAccounts from "@/lib/models/AdminAccounts";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_key"; // 🔥 Use JWT_SECRET for security

// 🟢 [GET] Fetch all admin accounts (excluding passwords)
export async function GET() { 
  try {
    await ConnectDB();
    const accounts = await AdminAccounts.find().select("-Password"); // Exclude passwords for security
    return NextResponse.json({ success: true, accounts }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// 🔵 [POST] Admin Login
export async function POST(request) {
  try {
    await ConnectDB();
    const { AdminUser, Password } = await request.json();

    if (!AdminUser || !Password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 🔍 Check if admin exists
    const admin = await AdminAccounts.findOne({ AdminUser });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🔑 Validate password (bcrypt comparison)
    const isPasswordValid = await bcrypt.compare(Password, admin.Password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 🛠 Generate JWT Token
    const token = jwt.sign(
      { AdminUser: admin.AdminUser, id: admin._id },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// 🟡 [PUT] Register New Admin
export async function PUT(request) {
  try {
    await ConnectDB();
    const { AdminUser, Password, Status = "Active" } = await request.json();

    if (!AdminUser || !Password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // 🔍 Check if user already exists
    const existingAdmin = await AdminAccounts.findOne({ AdminUser });
    if (existingAdmin) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
    }

    // 🔑 Hash password before saving
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newAdmin = new AdminAccounts({ AdminUser, Password: hashedPassword, Status });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
