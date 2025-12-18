import Link from "next/link";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User"; // Import to ensure Model is registered

// Function to fetch recent projects (Only runs on server)
async function getRecentProjects() {
  try {
    await connectToDatabase();
    // Ensure User model is registered before population
    // (Just importing it at the top is usually enough with Mongoose)
    
    const projects = await Project.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("userId", "name branch");

    // Serialize Mongoose objects to plain JSON
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    console.error("Error fetching recent projects:", error);
    return [];
  }
}

export default async function Home() {
  // Check if user is logged in by looking for the token cookie
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token");

  // If logged in, fetch data. If not, empty array.
  const recentProjects = isLoggedIn ? await getRecentProjects() : [];

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      
      {/* --- HERO SECTION --- */}
      <section className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            {isLoggedIn ? "Welcome Back" : "Build. Share. Collaborate."}
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/80 max-w-3xl mx-auto">
            {isLoggedIn 
              ? "See what your peers are working on today or find the parts you need for your next big idea."
              : "The ultimate platform for students to showcase microprojects, borrow components, and find mentorship within campus."
            }
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/components"
              className="bg-background text-foreground px-8 py-3 rounded-lg font-bold text-lg hover:bg-background/90 transition-colors shadow-lg"
            >
              {isLoggedIn ? "Browse Marketplace" : "Browse Components"}
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard" : "/projects"}
              className="border-2 border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              {isLoggedIn ? "Go to Dashboard" : "View Projects"}
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION (Common) --- */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why use CampusShare?
            </h2>
            <p className="mt-4 text-xl text-muted-foreground">
              Stop buying expensive parts for one-time use. Start collaborating.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-card rounded-2xl border border-border hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Component Lending</h3>
              <p className="text-muted-foreground leading-relaxed">
                Need an Arduino for 2 days? Don't buy it. Borrow from seniors or peers who have spare parts gathering dust.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-card rounded-2xl border border-border hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Project Showcase</h3>
              <p className="text-muted-foreground leading-relaxed">
                Document your hard work. Upload code snippets, diagrams, and results to build a portfolio that stands out.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-card rounded-2xl border border-border hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Trust & Community</h3>
              <p className="text-muted-foreground leading-relaxed">
                A closed ecosystem for our college. Build your <strong>Reputation Score</strong> by helping others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- DYNAMIC BOTTOM SECTION --- */}
      {isLoggedIn ? (
        // LOGGED IN VIEW: Recent Projects Showcase
        <section className="py-20 bg-secondary/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Fresh from the Lab 🧪</h2>
                <p className="mt-2 text-muted-foreground">Latest innovations by your college peers.</p>
              </div>
              <Link href="/projects" className="text-accent font-medium hover:underline hidden sm:block">
                View All Projects &rarr;
              </Link>
            </div>

            {recentProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentProjects.map((project: any) => (
                  <Link href="/projects" key={project._id} className="group block h-full">
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                      <div className="h-2 bg-accent"></div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
                            {project.techStack[0] || "Project"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            by {project.userId?.name}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                          {project.description}
                        </p>
                        <div className="text-sm font-medium text-accent mt-auto">
                          Read Documentation &rarr;
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No projects yet. Be the first to upload!</p>
                <Link href="/projects/add" className="text-accent font-bold mt-2 inline-block">
                  Upload Project
                </Link>
              </div>
            )}
            
            <div className="mt-8 text-center sm:hidden">
               <Link href="/projects" className="text-accent font-medium hover:underline">
                View All Projects &rarr;
              </Link>
            </div>
          </div>
        </section>
      ) : (
        // GUEST VIEW: Call to Action + How it Works
        <>
          {/* How it Works Section */}
          <section className="py-20 bg-secondary/30 border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center text-foreground mb-12">
                How it Works
              </h2>
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div className="relative">
                  <div className="text-[#FF6D1F] text-6xl font-bold  mb-4">01</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Sign Up</h4>
                  <p className="text-sm text-muted-foreground">Register with your college email ID to verify your student status.</p>
                </div>
                <div className="relative">
                  <div className="text-[#FF6D1F] text-6xl font-bold  mb-4">02</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">List or Request</h4>
                  <p className="text-sm text-muted-foreground">Post extra components you own or request items you need.</p>
                </div>
                <div className="relative">
                  <div className="text-[#FF6D1F] text-6xl font-bold  mb-4">03</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Connect</h4>
                  <p className="text-sm text-muted-foreground">Approve requests via the dashboard and meet on campus.</p>
                </div>
                <div className="relative">
                  <div className="text-[#FF6D1F] text-6xl font-bold  mb-4">04</div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">Build & Return</h4>
                  <p className="text-sm text-muted-foreground">Complete your project, return the item, and earn reputation points.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary text-primary-foreground py-20">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to start building?</h2>
              <p className="mb-8 text-primary-foreground/80 text-lg">
                Join students from CSE, ECE, ME, and more. 
                Stop working in silos and start leveraging the community power.
              </p>
              <Link
                href="/register"
                className="inline-block bg-background text-foreground font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Create Your Account
              </Link>
              <p className="mt-4 text-sm text-primary-foreground/60">
                Already have an account? <Link href="/login" className="text-primary-foreground font-bold hover:underline">Log in here</Link>
              </p>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-4">
            © {new Date().getFullYear()} CampusShare. Built for students, by students.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <Link href="/components" className="hover:text-foreground">Marketplace</Link>
            <Link href="/projects" className="hover:text-foreground">Showcase</Link>
            <Link href="/dashboard" className="hover:text-foreground">My Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}