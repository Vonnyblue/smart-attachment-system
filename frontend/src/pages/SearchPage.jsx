import React, { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Clock,
  ExternalLink,
  Filter,
  Loader2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import { internshipAPI } from "../services/api";

const normalizeJob = (item, index) => ({
  id: item.id || item.job_id || `job-${index}`,
  title: item.title || item.job_title || "Internship Opportunity",
  company: item.company || item.company_name || item.employer_name || "Hiring Team",
  location: item.location || item.job_location || "Flexible",
  salary: item.salary || "Not specified",
  type: item.employment_type || item.job_type || "Internship",
  category: item.category || item.job_category || "General",
  description: item.description || "Explore this opportunity and apply if it fits your goals.",
  applyLink: item.apply_link || null,
});

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadInternships = async (params = {}) => {
    setLoading(true);
    setError("");
    try {
      const data = await internshipAPI.searchInternships({
        query: params.query ?? searchQuery,
        location: params.location ?? location,
        page: params.page ?? 1,
      });
      setInternships((data.results || []).map(normalizeJob));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get("q") || "software engineering internship";
    setSearchQuery(initialQuery);
    loadInternships({ query: initialQuery });
  }, []);

  const filteredInternships = useMemo(() => {
    if (jobType === "all") return internships;
    return internships.filter((job) =>
      (job.type || "").toLowerCase().includes(jobType.toLowerCase())
    );
  }, [internships, jobType]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadInternships();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Find jobs and apply on the source site</h1>
            <p className="text-lg text-slate-600 mt-3 max-w-3xl mx-auto">
              Search by field, skill, or location, then open the original listing and complete your application there.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-5xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by role, company, field, or skills"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All types</option>
                  <option value="intern">Internship</option>
                  <option value="remote">Remote</option>
                  <option value="full">Full-time</option>
                </select>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <Filter size={16} className="mr-2" />
                  {showFilters ? "Hide search tips" : "Show search tips"}
                </button>
                <Button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white">
                  <Search size={18} className="mr-2" />
                  Search
                </Button>
              </div>

              {showFilters && (
                <div className="mt-4 rounded-xl bg-white border border-slate-200 p-4 text-sm text-slate-600">
                  Try phrases like `software engineering internship`, `data analyst`, `marketing graduate`, or combine your field with a city.
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Opportunities</h2>
            <p className="text-slate-600 mt-1">{filteredInternships.length} results ready to explore</p>
          </div>
          <div className="inline-flex items-center rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-700">
            <Sparkles size={16} className="mr-2" />
            Open the source listing to complete your application.
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-600">
            <Loader2 className="animate-spin mr-3" size={24} />
            Loading opportunities...
          </div>
        ) : filteredInternships.length === 0 ? (
          <Card>
            <CardBody className="p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">No jobs matched this search</h3>
              <p className="text-slate-600 mt-2">Try a broader keyword, a different location, or clear the type filter.</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInternships.map((job) => (
              <Card key={job.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
                <CardBody className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-slate-600 mt-1">{job.company}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {job.type}
                    </span>
                  </div>

                  <p className="mt-4 text-slate-600 leading-6">{job.description}</p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="inline-flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {job.location}
                    </div>
                    <div className="inline-flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      {job.salary}
                    </div>
                    <div className="inline-flex items-center">
                      <Clock size={16} className="mr-2" />
                      {job.category}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">External job listing</span>
                    <Button
                      onClick={() => job.applyLink && window.open(job.applyLink, "_blank", "noopener,noreferrer")}
                      className="bg-slate-900 hover:bg-slate-800 text-white"
                      disabled={!job.applyLink}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      {job.applyLink ? "Open listing" : "Link unavailable"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchPage;
