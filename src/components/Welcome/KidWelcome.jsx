import React from 'react';
import { useNavigate } from 'react-router-dom';
import './KidWelcome.css';

const KidWelcome = ({ username }) => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/task/0');
    };

    return (
        <div className="welcome-container">
            <div className="left-card">
                <h3>🎁 Rewards & Rankings</h3>
                <p className="coming-soon">coming soon...</p>
            </div>

            <div className="center-card">
                <h1>Welcome, <span className="username">{username}</span>!</h1>
                <p><span className="streak-icon">🔥</span> <span className="streak">3-day streak!</span> Keep it going.</p>

                <div className="explanation-box">
                    <p className="title">Let's track your exercises and see how strong you're getting!</p>
                    <p className="subtitle">What are CMAS Exercises?</p>
                    <p>
                        CMAS exercises help your doctor understand how your muscles are doing.
                        These simple tasks show how strong you are getting over time.
                    </p>
                    <div className="icons">⭐ 💪 🏆</div>
                    <button className="start-button" onClick={handleStart}>Let’s Start! 🚀</button>
                </div>
            </div>

            <div className="right-card">
                <h3>Today’s Challenge</h3>
                <div className="challenge-box">Hold your arms up for 10 seconds</div>
            </div>
        </div>
    );
};

export default KidWelcome;
