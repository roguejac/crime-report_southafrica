import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "./config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainDashboard from "./MainDashboard";
import AdminDashboard from "./AdminDashboard";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  </Router>
);

export default App;
