import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import Help from './components/pages/Help';
import Scanner from './components/pages/Scanner'; // Import the Scanner component

function App() {
  return (
    <Router>
      <div>
        {/* ✅ Navbar */}
        <nav className="top-navbar">
          <div className="nav-title">Women Rights</div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">In Marathi</Link>
            <Link to="/contact">In English</Link>
            <Link to="/help">In Hindi</Link>
            <Link to="/scanner" className="scanner-link">Document Scanner</Link>
          </div>
        </nav>

        {/* ✅ Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/scanner" element={<Scanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;