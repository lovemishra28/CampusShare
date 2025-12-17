"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProfileData {
  user: {
    name: string;
    email: string;
    branch: string;
    year: number;
    reputationScore: number;
    createdAt: string;
  };
  projects: any[];
  inventory: any[];
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const profileData = await res.json();
          setData(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading Profile...</div>;
  if (!data) return <div className="text-center py-20 text-red-500">Failed to load profile. Please log in.</div>;

  const { user, projects, inventory } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8 border border-gray-100">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full  p-1 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600 bg-indigo-50">
              {user.name.charAt(0)}
            </div>
            <div className="ml-4 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="ml-auto flex gap-3">
                 <Link href="/components/add" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                  + List Item
                </Link>
                <Link href="/projects/add" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
                  + Add Project
                </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-gray-100 pt-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Branch & Year</p>
              <p className="text-lg font-semibold text-gray-900">{user.branch} - Year {user.year}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reputation Score</p>
              <div className="flex items-center">
                <span className={`text-2xl font-bold mr-2 ${user.reputationScore >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.reputationScore}
                </span>
                <span className="text-xs text-gray-400">points</span>
              </div>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Projects Built</p>
               <p className="text-lg font-semibold text-gray-900">{projects.length}</p>
            </div>
            <div>
               <p className="text-sm font-medium text-gray-500">Community Rank</p>
               <p className="text-lg font-semibold text-gray-900">
                 {user.reputationScore > 100 ? "Expert" : user.reputationScore > 50 ? "Contributor" : "Member"}
               </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Inventory */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">My Inventory / Requests</h2>
            {inventory.length === 0 ? (
                <p className="text-gray-500 text-sm">You haven't listed any items or requests.</p>
            ) : (
                <ul className="space-y-4">
                {inventory.map((item: any) => (
                    <li key={item._id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div>
                        <p className="text-sm font-medium text-gray-900 truncate w-40">{item.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'GIVE' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                            {item.type}
                        </span>
                        <span className={`ml-2 text-xs text-gray-500`}>{item.status}</span>
                    </div>
                    </li>
                ))}
                </ul>
            )}
             <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                    Go to Transaction Dashboard &rarr;
                </Link>
             </div>
          </div>
        </div>

        {/* Right Column: Projects */}
        <div className="lg:col-span-2">
           <h2 className="text-xl font-bold text-gray-900 mb-4">My Projects</h2>
           {projects.length === 0 ? (
               <div className="bg-white rounded-lg p-10 text-center border-2 border-dashed border-gray-300">
                   <p className="text-gray-500 mb-4">You haven't uploaded any projects yet.</p>
                   <Link href="/projects/add" className="text-indigo-600 font-medium hover:underline">
                       Start Building Your Portfolio
                   </Link>
               </div>
           ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {projects.map((project: any) => (
                       <div key={project._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                           <h3 className="font-bold text-gray-900 text-lg mb-2">{project.title}</h3>
                           <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                           <div className="flex flex-wrap gap-2 mb-4">
                               {project.techStack.slice(0, 3).map((tech: string) => (
                                   <span key={tech} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                       {tech}
                                   </span>
                               ))}
                           </div>
                           {project.githubLink && (
                               <a href={project.githubLink} target="_blank" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
                                   View Code
                               </a>
                           )}
                       </div>
                   ))}
               </div>
           )}
        </div>
      </div>
    </div>
  );
}