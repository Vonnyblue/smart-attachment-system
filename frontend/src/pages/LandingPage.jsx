import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Clock, Loader2, MapPin, Search } from "lucide-react";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import { internshipAPI } from "../services/api";

const normalizeFeaturedJob = (item, index) => ({
  id: item.id || item.job_id || index + 1,
  title: item.title || item.job_title || "Internship Opportunity",
  company: item.company || item.company_name || item.employer_name || "Hiring Team",
  location: item.location || item.job_location || "Flexible",
  salary: item.salary || "Competitive package",
  category: item.category || item.job_category || "Technology",
  logo: (item.company || item.company_name || item.employer_name || "TC").substring(0, 2).toUpperCase(),
  featured: index < 3,
});

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [heroQuery, setHeroQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedJobs = async () => {
      try {
        const data = await internshipAPI.searchInternships({
          query: "software engineering",
          page: 1,
        });
        setFeaturedJobs((data.results || []).slice(0, 6).map(normalizeFeaturedJob));
      } catch (error) {
        setFeaturedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedJobs();
  }, []);

  const skills = ["Marketing", "Computer Science", "Artificial Intelligence", "Data Science", "Engineering", "Finance"];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2070&q=80"
            alt="Career opportunities background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                Search smarter and apply faster
              </h1>
              <p className="text-xl mb-8 text-blue-100 max-w-xl">
                Students get personalized search guidance and external application links, while admins oversee users and overall platform activity.
              </p>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 mb-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, or skills..."
                      value={heroQuery}
                      onChange={(e) => setHeroQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-lg"
                    onClick={() => navigate(`/search${heroQuery ? `?q=${encodeURIComponent(heroQuery)}` : ""}`)}
                  >
                    <Search size={20} className="mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-blue-200 text-sm font-medium mb-2 block">Popular skills:</span>
                {skills.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(skill)}`)}
                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-all border border-white/30"
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-white">Student</div>
                  <div className="text-blue-200 text-sm">Search and apply outward</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">Admin</div>
                  <div className="text-blue-200 text-sm">Monitor users and activity</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">Live links</div>
                  <div className="text-blue-200 text-sm">Open source listings directly</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60"
                  alt="Professional person"
                  className="rounded-xl shadow-xl w-full"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-xl rotate-3">
                  <p className="font-semibold">Simplified demo flow</p>
                  <p className="text-sm opacity-90">Student search plus admin oversight</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Bookmark className="text-blue-600" size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">A cleaner product focus</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Students can discover opportunities quickly, and admins can validate that signups, profiles, and search visibility are all working during your presentation.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/register?role=student")} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              Create student account
            </Button>
            <Button onClick={() => navigate("/register?role=admin")} variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
              Create admin account
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured opportunities</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore live results and jump straight to the main search experience when you are ready.
                <Link to="/about" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">Learn more</Link>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {loading ? (
                <Loader2 className="animate-spin text-blue-600" size={20} />
              ) : (
                <span className="text-gray-600 font-medium">{featuredJobs.length} highlighted jobs</span>
              )}
              <Link to="/search">
                <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  View all
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardBody className="p-6">
                    <div className="space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <Card key={job.id} className="shadow-lg border-slate-200 hover:shadow-xl transition-shadow">
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3 shadow-lg">
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                          <p className="text-gray-600">{job.company}</p>
                        </div>
                      </div>
                      {job.featured && (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="space-y-3 mb-4 text-gray-600">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        {job.category}
                      </div>
                      <div className="text-sm font-medium text-blue-700">{job.salary}</div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1 rounded-full">
                        {job.category}
                      </span>
                      <Button onClick={() => navigate("/search")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 text-sm shadow-lg">
                        Explore
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="lg:col-span-3 shadow-lg border-slate-200">
                <CardBody className="p-10 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">No featured jobs available right now</h3>
                  <p className="text-gray-600 mt-2">
                    The home page is now using fetched data only. Use the main search page to query fresh opportunities.
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => navigate("/search")} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Open job search
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
