import { useState, useEffect } from 'react';
import { SiteHealth } from '../types/site';
import { getHistory } from '../actions/site';

export function useSiteHistory(siteId: number | undefined) {
  const [history, setHistory] = useState<SiteHealth[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
      if (!siteId) return;
    
      const fetchHistory = async () => {
        setIsLoading(true);
        try {
          const data = await getHistory(siteId);
          console.log("Fetched history:", data);
          setHistory(data);
        } catch (err) {
          console.error("Failed to fetch history:", err);
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchHistory();
  }
  useEffect(() => {
    fetchData();
  }, [siteId]);

  return { history, isLoading , refresh : fetchData};
}