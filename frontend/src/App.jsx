import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainDashboard from './MainDashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
