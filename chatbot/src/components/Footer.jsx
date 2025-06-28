import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="section-header">
            <div className="icon-circle">🧠</div>
            <h3>Brain Power Tips</h3>
          </div>
          <ul className="stats-list">
            <li>
              <span className="stat-value">25%</span>
              <span className="stat-desc">Productivity increase with regular breaks</span>
            </li>
            <li>
              <span className="stat-value">52 mins</span>
              <span className="stat-desc">Optimal focus session length</span>
            </li>
            <li>
              <span className="stat-value">8 glasses</span>
              <span className="stat-desc">Daily water intake for peak performance</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="section-header">
            <div className="icon-circle">🎯</div>
            <h3>Concentration Stats</h3>
          </div>
          <ul className="stats-list">
            <li>
              <span className="stat-value">40%</span>
              <span className="stat-desc">Memory improvement with meditation</span>
            </li>
            <li>
              <span className="stat-value">15%</span>
              <span className="stat-desc">Focus boost from natural light</span>
            </li>
            <li>
              <span className="stat-value">20 mins</span>
              <span className="stat-desc">Exercise enhances cognition</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="section-header">
            <div className="icon-circle">⚡</div>
            <h3>Efficiency Facts</h3>
          </div>
          <ul className="stats-list">
            <li>
              <span className="stat-value">2.3x</span>
              <span className="stat-desc">Note-taking improves retention</span>
            </li>
            <li>
              <span className="stat-value">60%</span>
              <span className="stat-desc">Noise cancellation increases accuracy</span>
            </li>
            <li>
              <span className="stat-value">7-9 hrs</span>
              <span className="stat-desc">Optimal sleep for clarity</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-ornament"></div>
        <p>© {new Date().getFullYear()} Focus Boost | Designed for Peak Performance</p>
      </div>
    </footer>
  );
}

export default Footer;