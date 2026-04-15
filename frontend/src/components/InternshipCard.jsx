export default function InternshipCard({ job }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently posted";
    return new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div style={card}>
      {/* Header */}
      <div style={cardHeader}>
        {job.logo ? (
          <img src={job.logo} alt={job.company} style={logo} />
        ) : (
          <div style={logoFallback}>
            {job.company?.charAt(0) || "?"}
          </div>
        )}
        <div>
          <h3 style={jobTitle}>{job.title}</h3>
          <p style={companyName}>{job.company}</p>
        </div>
      </div>

      {/* Meta */}
      <div style={metaRow}>
        <span style={metaTag}>📍 {job.location || "Location N/A"}</span>
        {job.is_remote && <span style={remoteBadge}>Remote</span>}
        <span style={metaTag}>🕐 {formatDate(job.date_posted)}</span>
      </div>

      {/* Description */}
      <p style={description}>{job.description}</p>

      {/* Footer */}
      <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={applyBtn}>
        Apply Now →
      </a>
    </div>
  );
}

const card = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  transition: "box-shadow 0.2s ease",
  maxWidth: "480px",
  width: "100%",
};
const cardHeader = {
  display: "flex", alignItems: "center", gap: "14px",
};
const logo = {
  width: "48px", height: "48px",
  borderRadius: "8px", objectFit: "contain",
  border: "1px solid #f0f0f0",
};
const logoFallback = {
  width: "48px", height: "48px",
  borderRadius: "8px", background: "#4f46e5",
  color: "#fff", display: "flex",
  alignItems: "center", justifyContent: "center",
  fontSize: "20px", fontWeight: "bold",
  flexShrink: 0,
};
const jobTitle = {
  margin: 0, fontSize: "16px",
  fontWeight: "600", color: "#111827",
};
const companyName = {
  margin: 0, fontSize: "14px", color: "#6b7280",
};
const metaRow = {
  display: "flex", flexWrap: "wrap", gap: "8px",
};
const metaTag = {
  fontSize: "13px", color: "#6b7280",
  background: "#f3f4f6", padding: "4px 10px",
  borderRadius: "20px",
};
const remoteBadge = {
  fontSize: "13px", color: "#065f46",
  background: "#d1fae5", padding: "4px 10px",
  borderRadius: "20px", fontWeight: "500",
};
const description = {
  fontSize: "14px", color: "#374151",
  lineHeight: "1.6", margin: 0,
};
const applyBtn = {
  display: "inline-block",
  marginTop: "4px",
  padding: "10px 20px",
  background: "#4f46e5",
  color: "#fff",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "14px",
  textAlign: "center",
  transition: "background 0.2s ease",
};