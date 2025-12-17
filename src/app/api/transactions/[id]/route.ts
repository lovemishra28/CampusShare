import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import Component from "@/models/Component";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { status } = await request.json(); // e.g., "ACTIVE", "COMPLETED", "REJECTED"
    const { id } = await params;
    const transactionId = id;

    await connectToDatabase();

    // 1. Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    // 2. Update Transaction Status
    transaction.status = status;
    await transaction.save();

    // 3. Update Component Status based on Transaction
    // If we activate a loan, mark component as BORROWED
    if (status === "ACTIVE") {
      await Component.findByIdAndUpdate(transaction.componentId, {
        status: "BORROWED",
      });
    }

    // If we complete a loan (return it) or reject it, mark component as AVAILABLE
    if (status === "COMPLETED" || status === "REJECTED" || status === "CANCELLED") {
      await Component.findByIdAndUpdate(transaction.componentId, {
        status: "AVAILABLE",
      });
    }

    return NextResponse.json({ message: "Status updated", transaction }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}