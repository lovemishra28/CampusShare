import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Build. Share. Collaborate.
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
            The ultimate platform for students to showcase microprojects, 
            borrow components, and find mentorship within campus.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/components"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse Components
            </Link>
            <Link
              href="/projects"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why use CampusShare?
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Stop buying expensive parts for one-time use. Start collaborating.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                📦
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Component Lending</h3>
              <p className="text-gray-600 leading-relaxed">
                Need an Arduino for 2 days? Don't buy it. Borrow from seniors or peers who have spare parts gathering dust.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🚀
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Project Showcase</h3>
              <p className="text-gray-600 leading-relaxed">
                Document your hard work. Upload code snippets, diagrams, and results to build a portfolio that stands out to recruiters.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Trust & Community</h3>
              <p className="text-gray-600 leading-relaxed">
                A closed ecosystem for our college. Build your <strong>Reputation Score</strong> by helping others and returning items on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How it Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="relative">
              <div className="text-6xl font-bold text-gray-200 mb-4">01</div>
              <h4 className="text-lg font-semibold mb-2">Sign Up</h4>
              <p className="text-sm text-gray-500">Register with your college email ID to verify your student status.</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-gray-200 mb-4">02</div>
              <h4 className="text-lg font-semibold mb-2">List or Request</h4>
              <p className="text-sm text-gray-500">Post extra components you own or request items you need.</p>
            </div>
            <div className="relative">
              <div className="text-6xl font-bold text-gray-200 mb-4">03</div>
              <h4 className="text-lg font-semibold mb-2">Connect</h4>
              <p className="text-sm text-gray-500">Approve requests via the dashboard and meet on campus.</p>
            </div>
            <div className="relative">
               <div className="text-6xl font-bold text-gray-200 mb-4">04</div>
              <h4 className="text-lg font-semibold mb-2">Build & Return</h4>
              <p className="text-sm text-gray-500">Complete your project, return the item, and earn reputation points.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start building?</h2>
          <p className="mb-8 text-gray-400 text-lg">
            Join students from CSE, ECE, ME, and more. 
            Stop working in silos and start leveraging the community power.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Create Your Account
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Already have an account? <Link href="/login" className="text-blue-400 hover:underline">Log in here</Link>
          </p>
        </div>
      </section>

       {/* Footer */}
       <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 mb-4">
            © {new Date().getFullYear()} CampusShare. Built for students, by students.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <Link href="/components" className="hover:text-gray-600">Marketplace</Link>
            <Link href="/projects" className="hover:text-gray-600">Showcase</Link>
            <Link href="/dashboard" className="hover:text-gray-600">My Dashboard</Link>
          </div>
        </div>
       </footer>
    </div>
  );
}