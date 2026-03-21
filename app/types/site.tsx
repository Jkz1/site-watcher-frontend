export interface Site {
  id: number;
  userID: number;
  url: string;
  name: string;
  last_status: number;
  latency_ms: number;
  is_active: boolean;
  created_at: string;
}
export interface SiteHealth {
  id: number;
  site_id: number;
  status_code: number;
  latency_ms: number;
  checked_at: string;
}
