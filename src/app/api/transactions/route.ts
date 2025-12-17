import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import Component from "@/models/Component";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate User
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const currentUserId = decoded.userId;

    const { componentId } = await request.json();

    await connectToDatabase();

    // 2. Fetch Component Info to figure out who is who
    const component = await Component.findById(componentId);
    if (!component) {
      return NextResponse.json({ message: "Component not found" }, { status: 404 });
    }

    if (component.status !== "AVAILABLE") {
      return NextResponse.json({ message: "Item is not available" }, { status: 400 });
    }

    if (component.userId.toString() === currentUserId) {
      return NextResponse.json({ message: "You cannot request your own item" }, { status: 400 });
    }

    // 3. Determine Roles
    let lenderId, borrowerId;

    if (component.type === "GIVE") {
      // User is asking to borrow an item listed as GIVE
      lenderId = component.userId;
      borrowerId = currentUserId;
    } else {
      // User is offering an item to someone who asked (TAKE)
      lenderId = currentUserId;
      borrowerId = component.userId;
    }

    // 4. Create Transaction
    const transaction = await Transaction.create({
      lenderId,
      borrowerId,
      componentId,
      status: "PENDING",
    });

    return NextResponse.json({ message: "Request sent successfully!", transaction }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}