"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "", // We'll handle this as a comma-separated string first
    githubLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated string to array
      const techStackArray = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech !== "");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          techStack: techStackArray,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-black text-2xl font-bold mb-6">Upload Project Documentation</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Smart Irrigation System"
            className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description / Documentation</label>
          <textarea
            name="description"
            rows={6}
            required
            placeholder="Describe your project, the problem it solves, and how it works..."
            className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tech Stack (Comma separated)</label>
          <input
            type="text"
            name="techStack"
            required
            placeholder="e.g., Arduino, React, Node.js, 3D Printing"
            className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.techStack}
            onChange={handleChange}
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700">GitHub / Documentation Link (Optional)</label>
          <input
            type="url"
            name="githubLink"
            placeholder="https://github.com/username/repo"
            className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.githubLink}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {loading ? "Uploading..." : "Publish Project"}
        </button>
      </form>
    </div>
  );
}