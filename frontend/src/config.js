// config.js
const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction
  ? "https://crime-report-southafrica.onrender.com"
  : "http://localhost:8000";
