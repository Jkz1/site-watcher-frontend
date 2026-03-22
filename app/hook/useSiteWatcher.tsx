import { useEffect } from "react";

// hooks/use-site-watcher.ts
interface SiteUpdate {
  type: string;
  data: {
    site_id: number;
    last_status: number;
    latency_ms: number;
    time_stamp: string;
  };
}

export const useSiteWatcher = (
  token: string | null, 
  // We accept the dispatch function from the dashboard
  setSites: React.Dispatch<React.SetStateAction<any[]>> 
) => {
  useEffect(() => {
    // GUARD: Don't connect if token is null
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    socket.onmessage = (event) => {
      const message: SiteUpdate = JSON.parse(event.data);

      if (message.type === 'SITE_UPDATE') {
        // Update the state that lives in dashboard.tsx
        setSites((prevSites) =>
          prevSites.map((site) =>
            site.id === message.data.site_id
              ? { 
                  ...site, 
                  last_status: message.data.last_status, 
                  latency_ms: message.data.latency_ms,
                  last_checked: message.data.time_stamp
                }
              : site
          )
        );
      }
    };

    return () => socket.close();
  }, [token, setSites]); // Dependencies
};