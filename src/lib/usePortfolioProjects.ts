import { useEffect, useState } from "react";
import { client } from "./sanityClient";
import { fetchPortfolioProjects, type PortfolioProject } from "./portfolio";

export function usePortfolioProjects({ featuredOnly = false }: { featuredOnly?: boolean } = {}) {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
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
        const result = await fetchPortfolioProjects(client, request.signal, featuredOnly);
        if (!active || request.signal.aborted) return;
        setProjects(result);
        setError(false);
      } catch {
        if (!active || request.signal.aborted) return;
        setError(true);
      } finally {
        if (active && !request.signal.aborted) setLoading(false);
      }
    };
    // Al regresar desde Studio se vuelven a consultar los proyectos publicados.
    const onVisible = () => { if (document.visibilityState === "visible") void load(); };
    void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      controller?.abort();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [attempt, featuredOnly]);

  const retry = () => { setLoading(true); setError(false); setAttempt((value) => value + 1); };
  return { projects, loading, error, retry };
}
