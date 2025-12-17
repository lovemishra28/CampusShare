import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Component from "@/models/Component";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();
    
    // FILTER ADDED: Only fetch items with status "AVAILABLE"
    const components = await Component.find({ status: "AVAILABLE" })
      .populate("userId", "name branch year reputationScore")
      .sort({ createdAt: -1 });

    return NextResponse.json(components, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching components" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized - No Token Found" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const body = await request.json();
    await connectToDatabase();

    const newComponent = await Component.create({
      ...body,
      userId: decoded.userId,
    });

    return NextResponse.json(newComponent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating component" },
      { status: 500 }
    );
  }
}