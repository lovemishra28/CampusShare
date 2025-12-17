import mongoose, { Schema, model, models } from "mongoose";

export interface IProject {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  techStack: string[]; // e.g. ["Arduino", "React", "3D Printing"]
  githubLink?: string;
  imageUrl?: string;   // URL to project image
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], default: [] },
    githubLink: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;