import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import Component from "@/models/Component";
import User from "@/models/User";           

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    await connectToDatabase();

    const transactions = await Transaction.find({
      $or: [{ lenderId: userId }, { borrowerId: userId }],
    })
      .populate("componentId", "title type category imageUrl")
      .populate("lenderId", "name email branch")
      .populate("borrowerId", "name email branch")
      .sort({ createdAt: -1 });

    const user = await User.findById(userId).select("_id name email");

    return NextResponse.json({ transactions, currentUser: user }, { status: 200 });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}