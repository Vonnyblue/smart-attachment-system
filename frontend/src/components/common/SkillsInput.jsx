import React, { useEffect, useRef, useState } from "react";
import { jobsAPI } from "../../services/api";

const SkillsInput = ({ value, onChange, name, label, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    jobsAPI.listSkills().then(setAllSkills).catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentSkills = value
    ? value.split(",").map(s => s.trim().toLowerCase()).filter(Boolean)
    : [];

  const handleInputChange = (e) => {
    const raw = e.target.value;
    setInputVal(raw);

    // Suggest based on last token being typed
    const lastToken = raw.split(",").pop().trim().toLowerCase();
    if (lastToken.length > 0) {
      const filtered = allSkills.filter(
        s => s.includes(lastToken) && !currentSkills.includes(s)
      );
      setSuggestions(filtered.slice(0, 6));
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputBlur = () => {
    // Commit typed value on blur
    setTimeout(() => {
      if (inputVal.trim()) {
        commitSkills(inputVal);
      }
    }, 150);
  };

  const commitSkills = (raw) => {
    const typed = raw.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    const merged = Array.from(new Set([...currentSkills, ...typed]));
    onChange({ target: { name, value: merged.join(", ") } });
    setInputVal("");
    setShowDropdown(false);
  };

  const addSkill = (skill) => {
    if (!currentSkills.includes(skill)) {
      const merged = [...currentSkills, skill];
      onChange({ target: { name, value: merged.join(", ") } });
    }
    setInputVal("");
    setShowDropdown(false);
  };

  const removeSkill = (skill) => {
    const updated = currentSkills.filter(s => s !== skill);
    onChange({ target: { name, value: updated.join(", ") } });
  };

  const handleKeyDown = (e) => {
    if ((e.key === "," || e.key === "Enter") && inputVal.trim()) {
      e.preventDefault();
      commitSkills(inputVal);
    }
  };

  return (
    <div ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}

      {/* Skill tags */}
      {currentSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {currentSkills.map(skill => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-primary-400 hover:text-primary-700 leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Text input */}
      <div className="relative">
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
          onFocus={() => {
            const lastToken = inputVal.split(",").pop().trim().toLowerCase();
            if (lastToken && suggestions.length > 0) setShowDropdown(true);
          }}
          placeholder={currentSkills.length > 0 ? "Add more skills..." : placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />

        {showDropdown && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
            {suggestions.map(skill => (
              <li
                key={skill}
                onMouseDown={() => addSkill(skill)}
                className="px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer"
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-1">Type and press comma or Enter to add. Click a suggestion to select.</p>
    </div>
  );
};

export default SkillsInput;