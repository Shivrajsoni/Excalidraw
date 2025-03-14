"use client";
import React from 'react';
import { 
  Pencil, 
  Share2, 
  Users, 
  Lock, 
  Shapes, 
  Sparkles,
  Github,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-sm z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shapes className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold">Excalidraw</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Blog</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Libraries</a>
            <button
            onClick={()=>
              router.push("/signup")
            } 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Signup
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Whiteboard for the
              <span className="text-blue-600"> Digital Age</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create beautiful hand-drawn diagrams, wireframes, and illustrations with our intuitive drawing tool.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                Start Drawing <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-200 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-300 transition">
                Try Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Pencil className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Intuitive Drawing</h3>
                <p className="text-gray-600">Create perfect shapes and smooth lines with our intelligent drawing recognition.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Real-time Collaboration</h3>
                <p className="text-gray-600">Work together with your team in real-time, no matter where they are.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">End-to-End Encryption</h3>
                <p className="text-gray-600">Your drawings are secure with our end-to-end encryption technology.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Trusted by millions worldwide</h2>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-gray-400" />
                <span className="text-2xl font-semibold text-gray-600">2M+</span>
                <span className="text-gray-500">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gray-400" />
                <span className="text-2xl font-semibold text-gray-600">10M+</span>
                <span className="text-gray-500">Drawings</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Shapes className="w-6 h-6 text-blue-600" />
                <span className="font-semibold">Excalidraw</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;