import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";

// GET: Fetch all projects
export async function GET() {
  try {
    await connectToDatabase();
    
    const projects = await Project.find({})
      .populate("userId", "name branch year")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching projects" },
      { status: 500 }
    );
  }
}

// POST: Create a new project
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const body = await request.json(); // { title, description, techStack, githubLink }

    await connectToDatabase();

    const newProject = await Project.create({
      ...body,
      userId: userId,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Project Creation Error:", error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500 }
    );
  }
}