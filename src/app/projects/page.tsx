"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  userId: {
    name: string;
    branch: string;
    year: number;
  };
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Student Projects
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explore what your peers are building and see their documentation.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/projects/add"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Upload Project
          </Link>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-10">Loading Showcase...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No projects uploaded yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600">
                      {project.userId?.branch}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <a href="#" className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                      {project.description}
                    </p>
                  </a>
                  
                  {/* Tech Stack Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex items-center">
                  <div className="shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {project.userId?.name?.charAt(0) || "?"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {project.userId?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                       Year {project.userId?.year} Student
                    </p>
                  </div>
                </div>
              </div>
              
              {project.githubLink && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Code / Docs &rarr;
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}