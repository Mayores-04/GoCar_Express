import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import AdminActivity from "@/lib/models/AdminActivity";

export async function GET() {
  try {
    await ConnectDB();

    // Ensure sorting by the correct field `createdAt` for the timestamp
    const activities = await AdminActivity.find().sort({ createdAt: -1 }); // Use createdAt instead of time
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
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, msg: "Message is required" },
        { status: 400 }
      );
    }

    const newActivity = new AdminActivity({ message });
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

export async function PUT(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Activity ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, msg: "Message is required" },
        { status: 400 }
      );
    }

    const updatedActivity = await AdminActivity.findByIdAndUpdate(
      id,
      { message },
      { new: true }
    );

    if (!updatedActivity) {
      return NextResponse.json(
        { success: false, msg: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: "Activity updated successfully",
      activity: updatedActivity,
    });
  } catch (error) {
    console.error("Error in PUT /api/activities:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Activity ID is required" },
        { status: 400 }
      );
    }

    const result = await AdminActivity.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/activities:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
