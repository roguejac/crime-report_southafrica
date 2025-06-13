import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import BASE_URL from './apiConfig';
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const MainDashboard = () => {
  const [area, setArea] = useState("South Africa");
  const [areas, setAreas] = useState(["South Africa", "Soweto", "Cape Town", "Durban", "Midrand", "Pretoria"]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (area) => {
    try {
      const res = await axios.get(`http://localhost:8000`, {
        params: { area: area === "South Africa" ? "" : area }
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    console.log("Fetching dashboard data...");
    axios.get(`${BASE_URL}`)
      .then(res => {
        console.log("Dashboard data fetched:", res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  const resetDashboard = () => setArea("South Africa");

  if (loading) {
    return <div>Loading dashboard...</div>;
  }
  return (
    <div>
      <h1>Main Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

  const {
    total_crimes,
    avg_per_day,
    avg_by_time,
    crimes_by_day,
    weekday_vs_weekend,
    weekend_by_time
  } = data;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">Crime Dashboard</h1>

      <div className="flex justify-between items-center gap-4">
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button
          onClick={resetDashboard}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Reset to National
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-4 bg-gray-100 rounded-xl text-center shadow-md">
          <h2 className="text-lg font-semibold">Total Crimes</h2>
          <p className="text-2xl font-bold">{total_crimes}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center shadow-md">
          <h2 className="text-lg font-semibold">Avg Crimes / Day</h2>
          <p className="text-2xl font-bold">{avg_per_day.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-xl text-center shadow-md">
          <h2 className="text-lg font-semibold">By Time of Day</h2>
          <p className="text-sm">Morning: {avg_by_time.morning}</p>
          <p className="text-sm">Day: {avg_by_time.day}</p>
          <p className="text-sm">Night: {avg_by_time.night}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Crimes Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(crimes_by_day).map(([day, count]) => ({ day, count }))}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">Weekday vs Weekend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(weekday_vs_weekend).map(([name, value]) => ({ name, value }))}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {Object.entries(weekday_vs_weekend).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow col-span-2">
          <h3 className="text-lg font-semibold mb-2">Weekend Crimes By Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(weekend_by_time).map(([time, count]) => ({ time, count }))}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
