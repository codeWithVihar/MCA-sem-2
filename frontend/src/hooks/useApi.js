import { useState, useEffect, useCallback } from "react";
import API from "../services/api";

/**
 * Custom hook for API data fetching.
 * @param {string} url - API endpoint to fetch
 * @param {object} options - { autoFetch: true, interval: null }
 * @returns {{ data, loading, error, refetch }}
 */
const useApi = (url, options = {}) => {
  const { autoFetch = true, interval = null } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get(url);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Optional polling interval
  useEffect(() => {
    if (!interval) return;

    const id = setInterval(fetchData, interval);
    return () => clearInterval(id);
  }, [interval, fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
