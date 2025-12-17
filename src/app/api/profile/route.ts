import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import Component from "@/models/Component";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    await connectToDatabase();

    // 1. Fetch User Details (exclude password)
    const user = await User.findById(userId).select("-password");
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // 2. Fetch User's Projects
    const projects = await Project.find({ userId: userId }).sort({ createdAt: -1 });

    // 3. Fetch User's Listed Components (Inventory)
    const inventory = await Component.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      user,
      projects,
      inventory
    }, { status: 200 });

  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}