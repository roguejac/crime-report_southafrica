import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";

const MainDashboard = () => {
  const [crimeStats, setCrimeStats] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard`)
      .then((res) => res.json())
      .then((data) => setCrimeStats(data))
      .catch((err) => console.error("API fetch error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>South African Crime Dashboard</h2>
      {crimeStats ? (
        <pre>{JSON.stringify(crimeStats, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MainDashboard;
