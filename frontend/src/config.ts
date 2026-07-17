const isProduction = window.location.hostname !== "localhost";

export const BACKEND_URL = isProduction
  ? "https://kubernates-dashboard-1.onrender.com"
  : "http://localhost:8080";