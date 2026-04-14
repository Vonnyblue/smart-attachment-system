import React from "react";
import { Link } from "react-router-dom";
import { Award, Globe, Shield, Target, TrendingUp, Users, Zap } from "lucide-react";
import Button from "../components/common/Button";

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              About Smart Attachment
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              A focused platform for students discovering internships and admins overseeing account activity, profile quality, and overall system readiness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=student">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all">
                  Create Student Account
                </Button>
              </Link>
              <Link to="/search">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Browse Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl mr-4 shadow-lg">
                  <Target className="text-white" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed">
                To help students discover better-fit opportunities faster while giving admins a clear view of who is using the platform and how complete their profiles are.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <Users className="text-blue-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Students</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover opportunities that match your unique skills, interests, and career aspirations with guided searches and recommended listings.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="text-green-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">For Admins</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Oversee user growth, profile readiness, and overall platform health from one clear operations dashboard.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-2xl text-white">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">2</div>
                  <div className="text-blue-100 text-lg">Core Personas</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">1</div>
                  <div className="text-blue-100 text-lg">Focused Search Flow</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">100%</div>
                  <div className="text-blue-100 text-lg">Demo-Friendly</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">Live</div>
                  <div className="text-blue-100 text-lg">External Listings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Smart Attachment?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The experience is intentionally focused: easier to explain, easier to demo, and easier to keep improving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={16} />
              </div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI-Inspired Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Students can refine their profile and receive more relevant search suggestions based on skills, field, and location.
              </p>
            </div>

            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Award size={16} />
              </div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Simplified Oversight</h3>
              <p className="text-gray-600 leading-relaxed">
                Admins get a clean view of user growth and profile completion without unnecessary role complexity.
              </p>
            </div>

            <div className="group relative bg-gradient-to-br from-cyan-50 to-sky-50 rounded-2xl p-8 border border-cyan-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-sky-600 text-white px-4 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Globe size={16} />
              </div>
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="text-cyan-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real External Links</h3>
              <p className="text-gray-600 leading-relaxed">
                Search results open the original source site, which keeps the student journey clear and realistic during presentations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Demo the Experience?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create a student account to search opportunities or an admin account to oversee how the platform is being used.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register?role=student">
                <Button className="group bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <span className="group-hover:text-blue-700 transition-colors">Create Student Account</span>
                </Button>
              </Link>
              <Link to="/register?role=admin">
                <Button
                  variant="outline"
                  className="group border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  <span className="group-hover:text-blue-600 transition-colors">Create Admin Account</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
