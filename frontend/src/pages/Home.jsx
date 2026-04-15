import { useState, useEffect, useContext } from "react";
import NavBar from "../components/NavBar";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import InternshipCard from "../components/InternshipCard";
import { searchInternships, matchInternships } from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [field, setField] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.field) {
      fetchMatchedJobs();
    }
  }, [user]);

  const fetchMatchedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await matchInternships({
        field: user.field,
        skills: user.skills,
        location: user.preferred_location,
      });
      setJobs(data.results);
    } catch (err) {
      setError("Could not load matched internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = async (e) => {
    e.preventDefault();
    if (!field.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchInternships({
        query: `${field} ${skills}`.trim(),
        location,
      });
      setJobs(data.results);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <NavBar
        onLogin={() => setShowLogin(true)}
        onRegister={() => setShowRegister(true)}
      />

      {/*GUEST*/}
      {!user && (
        <div className="guest-hero">
          <div className="guest-hero-text">
            <h1>Find Your Internship</h1>
            <p>Enter your details below to discover opportunities tailored to you.</p>
          </div>

          <form className="guest-form" onSubmit={handleGuestSearch}>
            <div className="form-group">
              <label>Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Software Engineering, Finance"
                value={field}
                onChange={(e) => setField(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Skills</label>
              <input
                type="text"
                placeholder="e.g. Python, React, Data Analysis"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Preferred Location</label>
              <input
                type="text"
                placeholder="e.g. Nairobi, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "Searching..." : "Find Internships"}
            </button>
          </form>

          {error && <p className="error-msg">{error}</p>}

          {jobs.length > 0 && (
            <div className="results-grid">
              {jobs.map((job) => (
                <InternshipCard key={job.job_id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* LOGGED IN VIEW */}
      {user && (
        <div className="auth-home">
          <div className="auth-home-header">
            <div>
              <h1>Welcome back, {user.name} 👋</h1>
              <p>Here are internships matched to your profile.</p>
            </div>
            <button className="refresh-btn" onClick={fetchMatchedJobs} disabled={loading}>
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p>Finding opportunities for you...</p>
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="empty-state">
              <p>No matches found. Try updating your profile with more skills or a different location.</p>
            </div>
          )}

          <div className="results-grid">
            {jobs.map((job) => (
              <InternshipCard key={job.job_id} job={job} />
            ))}
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </div>
  );
}

export default Home;