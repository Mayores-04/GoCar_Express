import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import AdminActivity from "@/lib/models/AdminActivity";

export async function GET() {
  try {
    await ConnectDB();
    const activities = await AdminActivity.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error("Error in GET /api/activities:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await ConnectDB();

    const body = await req.json();
    const { message, time } = body;

    if (!message || !time) {
      return NextResponse.json(
        { success: false, msg: "Message and time are required" },
        { status: 400 }
      );
    }

    const newActivity = new AdminActivity({ message, time });
    await newActivity.save();

    return NextResponse.json({
      success: true,
      msg: "Activity logged successfully",
      activity: newActivity,
    });
  } catch (error) {
    console.error("Error in POST /api/activities:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
