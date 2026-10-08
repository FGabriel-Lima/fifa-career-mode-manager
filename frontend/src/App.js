import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CareerDetailsPage from './pages/CareerDetailsPage';
import HallOfFamePage from './pages/HallOfFamePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/career/:id" element={<CareerDetailsPage />} />
          <Route path="/carreira/:id/hall-of-fame" element={<HallOfFamePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;