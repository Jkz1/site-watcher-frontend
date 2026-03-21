import { useEffect, useState } from 'react';


interface SiteUpdate {
  type: string;
  data: {
    site_id: number;
    last_status: number;
    latency_ms: number;
    time_stamp : string;
  };
}

export const useSiteWatcher = (initialSites: any[], token: string | null) => {
  const [sites, setSites] = useState(initialSites);

  useEffect(() => {
    
    
    const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    socket.onopen = () => {
      console.log('Connected to Site Watcher Hub');
    };

    socket.onmessage = (event) => {
      const message: SiteUpdate = JSON.parse(event.data);

      if (message.type === 'SITE_UPDATE') {
        
        console.log("Hub message received:", message);
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

    socket.onclose = () => {
      console.log('Disconnected from Hub');
    };

    return () => socket.close();
  }, [token, initialSites]);

  return { sites, setSites };
};