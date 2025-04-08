import React, { useEffect, useState } from 'react';
import './Confetti.css'; // Import the CSS file we created

const Confetti = ({ count = 30 }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    const colors = ['#FFC700', '#FF0058', '#2E3191', '#41EAD4', '#FBFF12'];
    
    // Create confetti particles
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2
      });
    }
    
    setParticles(newParticles);
    
    // Clean up
    return () => {
      setParticles([]);
    };
  }, [count]);

  return (
    <div className="confetti-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 10 }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="confetti"
          style={{
            '--color': particle.color,
            '--delay': `${particle.delay}s`,
            '--fall-duration': `${particle.duration}s`,
            left: `${particle.x}%`,
            top: '0'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
