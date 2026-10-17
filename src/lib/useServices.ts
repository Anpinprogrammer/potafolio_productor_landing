import { useEffect, useState } from "react";
import { client } from "./sanityClient";
import { fetchServices, type Service } from "./services";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const load = async () => {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      try {
        const result = await fetchServices(client, request.signal);
        if (!active || request.signal.aborted) return;
        setServices(result);
        setError(false);
      } catch {
        if (!active || request.signal.aborted) return;
        setError(true);
      } finally {
        if (active && !request.signal.aborted) setLoading(false);
      }
    };
    const onVisible = () => { if (document.visibilityState === "visible") void load(); };
    void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [attempt]);

  const retry = () => { setLoading(true); setError(false); setAttempt((value) => value + 1); };
  return { services, loading, error, retry };
}
