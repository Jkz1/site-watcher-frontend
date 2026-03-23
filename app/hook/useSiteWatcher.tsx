import { useEffect } from "react";


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
  
  setSites: React.Dispatch<React.SetStateAction<any[]>> 
) => {
  useEffect(() => {
    
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    socket.onmessage = (event) => {
      const message: SiteUpdate = JSON.parse(event.data);

      if (message.type === 'SITE_UPDATE') {
        
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
  }, [token, setSites]); 
};