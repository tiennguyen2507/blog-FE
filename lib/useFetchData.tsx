import { useState, useEffect, useCallback, useRef } from "react";
import httpRequest from "./httpRequest";

// Simple in-memory cache
const cache: Record<string, unknown> = {};

interface UseFetchDataOptions {
  enabled?: boolean;
  cacheKey?: string;
  cacheTime?: number; // ms
  params?: Record<string, string | number | boolean | undefined>;
}

export function useFetchData<T = unknown>(
  url: string,
  options?: UseFetchDataOptions
) {
  const {
    enabled = true,
    cacheKey,
    cacheTime = 5 * 60 * 1000,
    params,
  } = options || {};
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const cacheTimer = useRef<NodeJS.Timeout | null>(null);

  // Cache key nên bao gồm cả params để tránh cache nhầm
  const key = cacheKey || url + (params ? JSON.stringify(params) : "");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (cache[key]) {
        setData((cache[key] as { data: T }).data);
        setLoading(false);
        return;
      }
      const response = await httpRequest.get<T>(url, { params });
      setData(response.data);
      cache[key] = { data: response.data };
      if (cacheTimer.current) clearTimeout(cacheTimer.current);
      cacheTimer.current = setTimeout(() => {
        delete cache[key];
      }, cacheTime);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, key, cacheTime, params]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, url, key]);

  const refetch = useCallback(() => {
    delete cache[key];
    fetchData();
  }, [fetchData, key]);

  return { data, error, loading, refetch };
}
