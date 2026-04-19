import React, { useEffect, useState } from "react";
import { LogOut, Plus, Trash2, Users, Briefcase, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { jobsAPI, applicationsAPI } from "../../services/api";
import SkillsInput from "../../components/common/SkillsInput";

const HRDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({title:  "", location: "", description: "", skills_required: "", is_remote: false, apply_link: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    jobsAPI.myJobs().then(setJobs).catch(() => {});
    applicationsAPI.forHR().then(setApplications).catch(() => {});
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
        const payload = {
        ...form,
        company: user?.company_name || "Unknown Company",
        };

        const job = await jobsAPI.createJob(payload);

        setJobs(prev => [job, ...prev]); 

        setForm({
        title: "",
        location: "",
        description: "",
        skills_required: "",
        is_remote: false,
        apply_link: ""
        });

        setShowForm(false);
    } catch (err) {
        setError(err.response?.data?.detail || "Failed to post job.");
    } finally {
        setSaving(false);
    }
};

  const handleDelete = async (id) => {
    await jobsAPI.deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleStatus = async (appId, status) => {
    await applicationsAPI.updateStatus(appId, status);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-slate-300 text-sm uppercase tracking-[0.2em]">HR Dashboard</p>
              <h1 className="text-4xl font-bold mt-2">{user?.company_name || user?.name}</h1>
              <p className="text-slate-300 mt-1">Manage your job postings and review student applications.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setShowForm(v => !v)} className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus size={16} className="mr-2" />
                Post a job
              </Button>
              <Button variant="outline" className="border-slate-500 text-white hover:bg-slate-800" onClick={() => { logout(); navigate("/"); }}>
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">{error}</div>}

        {/* Post job form */}
        {showForm && (
          <Card>
            <CardBody className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">New job posting</h2>
              <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Title"
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Intern / Developer / etc"
                />
                <Input label="Location" name="location" value={form.location} onChange={handleFormChange} placeholder="Nairobi, Remote..." />
                <Input
                  label="Application link (optional)"
                  name="apply_link"
                  value={form.apply_link}
                  onChange={handleFormChange}
                  placeholder="https://careers.company.com/apply..."
                />
                <SkillsInput
                  label="Skills required"
                  name="skills_required"
                  value={form.skills_required}
                  onChange={handleFormChange}
                  placeholder="React, Python, Excel..."
                />
                <div className="flex items-center gap-2 mt-6">
                  <input type="checkbox" id="is_remote" name="is_remote" checked={form.is_remote} onChange={handleFormChange} className="h-4 w-4" />
                  <label htmlFor="is_remote" className="text-sm text-slate-700">Remote position</label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleFormChange} rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" variant="primary" className="w-full" disabled={saving}>
                    {saving ? "Posting..." : "Post job"}
                  </Button>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}

        {/* My job postings */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Briefcase size={20} className="text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-900">Your postings ({jobs.length})</h2>
            </div>
            {jobs.length === 0 ? (
              <p className="text-slate-500">No jobs posted yet. Click "Post a job" to get started.</p>
            ) : (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-start justify-between border border-slate-200 rounded-xl p-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{job.location || "No location"} · {job.is_remote ? "Remote" : "On-site"}</p>
                      {job.skills_required && <p className="text-xs text-slate-400 mt-1">Skills: {job.skills_required}</p>}
                    </div>
                    <button onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-600 ml-4">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Applications */}
        <Card>
          <CardBody className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users size={20} className="text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-900">Applications ({applications.length})</h2>
            </div>
            {applications.length === 0 ? (
              <p className="text-slate-500">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{app.student_name}</p>
                        <p className="text-sm text-slate-500">{app.student_email}</p>
                        {app.student_skills && <p className="text-xs text-slate-400 mt-1">Skills: {app.student_skills}</p>}
                        <p className="text-sm text-slate-600 mt-1">Applied for: <span className="font-medium">{app.job_title}</span></p>
                        {app.cover_note && <p className="text-sm text-slate-600 mt-2 italic">"{app.cover_note}"</p>}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {app.status === "pending" ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleStatus(app.id, "accepted")} className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                              <CheckCircle size={16} /> Accept
                            </button>
                            <button onClick={() => handleStatus(app.id, "rejected")} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium">
                              <XCircle size={16} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`text-sm font-medium ${app.status === "accepted" ? "text-emerald-600" : "text-red-500"}`}>
                            {app.status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HRDashboard;