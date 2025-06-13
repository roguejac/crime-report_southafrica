import React, { useEffect, useState } from "react";
import axios from 'axios';
import BASE_URL from './apiConfig';
import { API_BASE_URL } from "./config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

useEffect(() => {
  axios.get(`${BASE_URL}/dashboard`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.error("Error fetching dashboard data:", err);
    });
}, []);

  if (!stats) return <p>Loading admin dashboard...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Users</h3>
          <p>{stats.total_users}</p>
        </div>
        <div style={cardStyle}>
          <h3>Predictions Made</h3>
          <p>{stats.predictions_made}</p>
        </div>
        <div style={cardStyle}>
          <h3>Crimes Reported</h3>
          <p>{stats.total_crime_reports}</p>
        </div>
      </div>

      <h2>Predictions Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={stats.prediction_trends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: "3rem" }}>Map of Crime Hotspots</h2>
      <div
        style={{
          height: "300px",
          width: "100%",
          background: "#ccc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          color: "#333",
        }}
      >
        [Map Placeholder]
      </div>
    </div>
  );
};

const cardStyle = {
  padding: "1rem",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  flex: "1 1 200px",
};

export default AdminDashboard;
