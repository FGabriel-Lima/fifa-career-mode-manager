import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // <-- Importar

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* <-- Usar na raiz */}
          <Route path="/dashboard" element={<h1>Bem-vindo ao Dashboard!</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;