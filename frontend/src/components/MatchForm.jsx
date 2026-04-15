import { useState } from "react";

export default function MatchForm({ onSearch, loading }) {
  const [form, setForm] = useState({ query: "", location: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.query.trim()) return;
    onSearch(form);
  };

  return (
    <form onSubmit={handleSubmit} className="match-form">
      <input
        name="query"
        placeholder="Field of study or job title (e.g. Software Engineering)"
        value={form.query}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Preferred location (e.g. Nairobi, Kenya)"
        value={form.location}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Find Internships"}
      </button>
    </form>
  );
}