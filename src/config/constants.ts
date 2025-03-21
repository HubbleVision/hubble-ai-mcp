// API endpoints and service configurations
export const QUICKCHART_BASE_URL =
  "https://quickchart-proxy.vercel.app/api/chart";
export const HUBBLE_API_URL = "http://ai-api.hubble-rpc.xyz:8181";

// Server configuration
export const SERVER_CONFIG = {
  name: "hubble-tool",
  version: "2.0.0",
};

// Tool names
export const TOOL_NAMES = {
  SEARCH_HUBBLE: "search-hubble",
  GENERATE_CHART: "generate_chart",
  DOWNLOAD_CHART: "download_chart",
} as const;
