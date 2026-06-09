// File: C:\Users\HP\expenses-tracker\frontend\src\pages\LandingPage.js
/*
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // styling

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="landing-page">
      <video autoPlay muted loop className="background-video">
        <source src="/videos/budget-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Expense Tracker</h1>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}

export default LandingPage;*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
function LandingPage() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/signup');
  };
  return (
    <div className="landing-container">
      <div className="left-section">
        <h1 class="title">
          <span class="big-letter">E</span>xpense
          <span class="spacer"></span>
          <span class="big-letter">T</span>racker
        </h1>


        <p className="caption">Every penny counts.</p>
        {/* Add more intro lines below if needed */}
        <button className="get-started" onClick={handleGetStarted}>
          Get Started
        </button>
      </div>
      <div className="right-section">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="/videos/budget-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
export default LandingPage;
