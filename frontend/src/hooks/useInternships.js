import { useState } from "react";
import { matchInternships, searchInternships } from "../services/api";
import { useAuth } from "./useAuth";

export const useInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const search = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await searchInternships(params);
      setInternships(results.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatches = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const results = await matchInternships(params);
      setInternships(results.results || []);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecommended = async () => {
    if (!user) return;

    return getMatches({
      field: user.field || "",
      skills: user.skills || "",
      location: user.preferred_location || "",
    });
  };

  return {
    internships,
    loading,
    error,
    search,
    getMatches,
    getRecommended,
  };
};
