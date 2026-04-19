import React, { useEffect } from "react";
import { MapPin, X, Wifi, Building2, Sparkles } from "lucide-react";
import Button from "./Button";

const JobModal = ({ job, onClose, onApply, appStatus, applyingTo }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!job) return null;

  const title = job.title || job.job_title;
  const company = job.company || job.company_name || job.employer_name;
  const location = job.location || job.job_location;
  const description = job.description || job.job_description;
  const skills = job.skills_required;

  const renderApplyButton = () => {
    if (!job.is_platform_job) {
      return job.apply_link ? (
        <Button
          className="bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => window.open(job.apply_link, "_blank", "noopener,noreferrer")}
        >
          Open external listing
        </Button>
      ) : null;
    }

    // Platform job with an external apply link — skip internal apply flow
    if (job.apply_link) {
      return (
        <Button
          className="bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => window.open(job.apply_link, "_blank", "noopener,noreferrer")}
        >
          Apply on company site
        </Button>
      );
    }

    // Platform job without a link — use internal apply flow
    if (appStatus === "accepted") return <span className="text-emerald-600 font-medium">✓ Accepted</span>;
    if (appStatus === "rejected") return <span className="text-red-500 font-medium">✗ Not selected</span>;
    if (appStatus === "pending") return <span className="text-slate-500 font-medium">Pending review</span>;

    return (
      <Button
        variant="primary"
        disabled={applyingTo === job.job_id}
        onClick={() => onApply(job.job_id)}
      >
        {applyingTo === job.job_id ? "Applying..." : "Apply now"}
      </Button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="pr-8">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm">
              <Building2 size={14} />
              <span>{company || "Company not listed"}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm">
            {location && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 rounded-full px-3 py-1">
                <MapPin size={13} /> {location}
              </span>
            )}
            {job.is_remote && (
              <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1">
                <Wifi size={13} /> Remote
              </span>
            )}
            {job.is_platform_job && (
              <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 rounded-full px-3 py-1">
                <Sparkles size={13} /> Posted on platform
              </span>
            )}
          </div>

          {/* Skills */}
          {skills && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Skills required</h3>
              <div className="flex flex-wrap gap-2">
                {skills.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                  <span key={skill} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">About the role</h3>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{description}</p>
            </div>
          )}

          {!description && (
            <p className="text-sm text-slate-400 italic">No description provided.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between">
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-700">
            Close
          </button>
          {renderApplyButton()}
        </div>
      </div>
    </div>
  );
};

export default JobModal;