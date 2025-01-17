import { NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import DashboardModel from "@/lib/models/DashboardModel";

export async function GET() {
  try {
    await ConnectDB();

    const dashboardData = await DashboardModel.find();
    return NextResponse.json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.error("Error in GET /api/admin/dashboard:", error.message);
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
    const { revenue, totalCarsRented } = body;

    const newDashboardData = new DashboardModel({ revenue, totalCarsRented });
    await newDashboardData.save();

    return NextResponse.json({
      success: true,
      msg: "Dashboard data saved successfully",
      dashboard: newDashboardData,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/dashboard:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Dashboard ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { revenue, totalCarsRented } = body;

    const updatedDashboard = await DashboardModel.findByIdAndUpdate(
      id,
      { revenue, totalCarsRented },
      { new: true }
    );

    if (!updatedDashboard) {
      return NextResponse.json(
        { success: false, msg: "Dashboard data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      dashboard: updatedDashboard,
    });
  } catch (error) {
    console.error("Error in PUT /api/admin/dashboard:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, msg: "Dashboard ID is required" },
        { status: 400 }
      );
    }

    const result = await DashboardModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, msg: "Dashboard data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: "Dashboard data deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/dashboard:", error.message);
    return NextResponse.json(
      { success: false, msg: "Internal server error" },
      { status: 500 }
    );
  }
}
