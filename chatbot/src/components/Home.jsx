import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import introImg from "../assets/w.webp";

export default function Home() {
  const [stage, setStage] = useState('intro');
  const navigate = useNavigate();

  useEffect(() => {
    const blurTimer = setTimeout(() => setStage('blur'), 2000);
    const homeTimer = setTimeout(() => setStage('home'), 3000);
    return () => {
      clearTimeout(blurTimer);
      clearTimeout(homeTimer);
    };
  }, []);
 
  const handleNavigation = (lang) => {
    if (lang === 'Marathi') navigate('/about');
    else if (lang === 'English') navigate('/contact');
    else if (lang === 'Hindi') navigate('/help');
  };

  return (
    <>
      {stage !== 'home' && (
        <div className={`intro-wrapper ${stage === 'blur' ? 'blurred' : ''}`}>
          <img src={introImg} alt="Intro" className="intro-image" />
        </div>
      )}

      {stage === 'home' && (
        <div className="home-container fade-in">
          <div className="language-card">
            <h1>Choose Your Language</h1>
            <p>Select your preferred language to continue</p>
            <div className="language-buttons">
              {['Marathi', 'English', 'Hindi'].map((lang) => (
                <button
                  key={lang}
                  className={`language-btn ${lang.toLowerCase()}`}
                  onClick={() => handleNavigation(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
