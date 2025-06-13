import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function MainDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        console.log('Fetching dashboard data...');
        const response = await axios.get('https://crime-report-southafrica.onrender.com'); // Replace with your actual backend URL
        console.log('Dashboard data fetched:', response.data);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center mt-10 text-xl">Loading dashboard...</div>;
  if (!dashboardData) return <div className="text-center mt-10 text-xl text-red-500">Failed to load dashboard data</div>;

  const { summary, top_areas, time_series } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">South African Crime Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Total Reports</h2>
            <p className="text-2xl">{summary.total_reports}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Most Common Crime</h2>
            <p className="text-lg">{summary.most_common_crime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold">Least Common Crime</h2>
            <p className="text-lg">{summary.least_common_crime}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Top Areas by Crime Count</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={top_areas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="area" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="crime_count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">Monthly Report Trends</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={time_series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MainDashboard;
