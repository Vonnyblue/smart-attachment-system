import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ExternalLink,
  GraduationCap,
  LogOut,
  MapPin,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import Button from "../../components/common/Button";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { internshipAPI } from "../../services/api";

const StudentDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    field: "",
    skills: "",
    preferred_location: "",
    bio: "",
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const buildSearchQuery = (profile = user) => {
    const parts = [profile?.field, profile?.skills]
      .filter(Boolean)
      .join(" ")
      .trim();

    return parts || "internship";
  };

  useEffect(() => {
    if (!user) return;
    setProfileData({
      name: user.name || "",
      field: user.field || "",
      skills: user.skills || "",
      preferred_location: user.preferred_location || "",
      bio: user.bio || "",
    });
  }, [user]);

  const loadRecommendations = async (profile = user) => {
    if (!profile) return;
    setLoadingRecommendations(true);
    setError("");
    try {
      const response = await internshipAPI.matchInternships({
        field: profile.field || "",
        skills: profile.skills || "",
        location: profile.preferred_location || "",
      });
      setRecommendations(response.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load recommendations.");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user?.id]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage("");
    setError("");
    const result = await updateProfile(profileData);
    setSavingProfile(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setMessage("Profile updated. Recommendations refreshed.");
    await loadRecommendations(result.user || profileData);
  };

  const profileCompletion = useMemo(() => {
    const values = [
      Boolean(user?.name),
      Boolean(user?.field),
      Boolean(user?.skills),
      Boolean(user?.preferred_location),
      Boolean(user?.bio),
    ];
    return Math.round((values.filter(Boolean).length / values.length) * 100);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-slate-300 text-sm uppercase tracking-[0.2em]">Student workspace</p>
              <h1 className="text-4xl font-bold mt-2">Welcome back, {user.name}</h1>
              <p className="text-slate-300 mt-2 max-w-2xl">
                Keep your profile up to date, discover relevant opportunities, and jump out to the original listing when you are ready to apply.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/search">
                <Button className="bg-white text-slate-900 hover:bg-slate-100">
                  <Search size={16} className="mr-2" />
                  Search jobs
                </Button>
              </Link>
              <Button
                className="bg-primary-600 hover:bg-primary-700 text-white"
                onClick={() => navigate(`/search?q=${encodeURIComponent(buildSearchQuery())}`)}
              >
                <Sparkles size={16} className="mr-2" />
                Search with my skills
              </Button>
              <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-800" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(message || error) && (
          <div className={`mb-6 rounded-xl px-4 py-3 ${error ? "bg-red-50 border border-red-200 text-red-700" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}>
            {error || message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="text-primary-600" size={28} />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center">
                    <GraduationCap size={16} className="mr-2 text-slate-400" />
                    {user.field || "Field of study not yet added"}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-slate-400" />
                    {user.preferred_location || "Preferred location not yet added"}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">Profile completion</span>
                    <span className="font-semibold text-slate-900">{profileCompletion}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-primary-600 rounded-full" style={{ width: `${profileCompletion}%` }}></div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-slate-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills ? (
                      user.skills.split(",").map((skill) => (
                        <span key={skill} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Add your skills below to improve the quality of your searches.</span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit profile</h3>
                <form onSubmit={handleProfileSave} className="space-y-4">
                  <Input label="Name" name="name" value={profileData.name} onChange={handleProfileChange} required />
                  <Input label="Field of study" name="field" value={profileData.field} onChange={handleProfileChange} placeholder="Computer Science, Accounting..." />
                  <Input label="Skills" name="skills" value={profileData.skills} onChange={handleProfileChange} placeholder="React, SQL, Public speaking..." />
                  <Input label="Preferred location" name="preferred_location" value={profileData.preferred_location} onChange={handleProfileChange} placeholder="Nairobi, Remote, Hybrid..." />
                  <Input label="Short bio" name="bio" value={profileData.bio} onChange={handleProfileChange} placeholder="A sentence about your strengths and goals" />
                  <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white" disabled={savingProfile}>
                    <Save size={16} className="mr-2" />
                    {savingProfile ? "Saving..." : "Save profile"}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardBody className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">Suggested searches</h2>
                    <p className="text-slate-600 mt-1">These are based on your profile and lead you to external application pages.</p>
                  </div>
                  <Button variant="outline" onClick={loadRecommendations}>
                    <RefreshCw size={16} className="mr-2" />
                    Refresh
                  </Button>
                </div>

                {loadingRecommendations ? (
                  <div className="text-slate-600">Loading recommendations...</div>
                ) : recommendations.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
                    <p className="text-slate-700 font-medium">No recommendations yet.</p>
                    <p className="text-slate-600 mt-2">Fill in your field and skills, then refresh to pull stronger matches.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 6).map((job, index) => (
                      <Card key={job.job_id || index} className="border-slate-200 shadow-sm">
                        <CardBody className="p-5">
                          <div>
                            <h3 className="font-semibold text-slate-900">{job.title || job.job_title}</h3>
                            <p className="text-slate-600 mt-1">{job.company || job.company_name || job.employer_name}</p>
                          </div>
                          <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <div className="flex items-center">
                              <MapPin size={15} className="mr-2" />
                              {job.location || job.job_location || "Flexible"}
                            </div>
                            <div className="inline-flex items-center text-primary-700">
                              <Sparkles size={15} className="mr-2" />
                              Suggested from your profile
                            </div>
                          </div>
                          <div className="mt-5 flex items-center justify-between">
                            <Link to={`/search?q=${encodeURIComponent(job.title || job.job_title || user.field || "internship")}`} className="text-sm font-medium text-primary-700 hover:text-primary-800">
                              View in search
                            </Link>
                            {job.apply_link && (
                              <Button
                                onClick={() => window.open(job.apply_link, "_blank", "noopener,noreferrer")}
                                className="bg-slate-900 hover:bg-slate-800 text-white"
                              >
                                <ExternalLink size={15} className="mr-2" />
                                Open
                              </Button>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-6">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">How to use the platform</h2>
                <div className="space-y-4 text-slate-600">
                  <p>1. Update your field, skills, and preferred location.</p>
                  <p>2. Use the `Search with my skills` button or recommended searches to discover relevant openings.</p>
                  <p>3. Open the original listing and complete your application directly on the source website.</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
