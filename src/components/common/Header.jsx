import React from 'react';
import './Header.css';
import logo from '../../assets/vusc-logo.png';

const Header = ({ username, onLogout }) => {
    // Check if it's a doctor or kid based on the username
    const isKid = username && username.toLowerCase().includes('testkid');

    return (
        <header className="header-bar">
            {/* Left section: logo + title */}
            <div className="header-section left">
                <img src={logo} alt="VUSC Logo" className="header-logo" />
                <span className="header-title">JDM CMAS Exercise Tracker</span>
            </div>

            {/* Center section: Level badge (only for kid) */}
            {isKid && (
                <div className="header-section center">
                    <div className="level-badge">level 1 : <strong>noob</strong></div>
                </div>
            )}

            {/* Right section: login info and logout */}
            <div className="header-section right">
                <span className="logged-in">Logged in as: <strong>{username}</strong></span>
                <button onClick={onLogout} className="logout-button">Log Out</button>
            </div>
        </header>
    );
};

export default Header;
