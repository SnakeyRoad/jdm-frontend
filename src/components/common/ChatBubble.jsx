// src/components/common/ChatBubble.jsx
import React, { useState } from 'react';
import './ChatBubble.css';

const ChatBubble = () => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="chat-bubble-wrapper"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="chat-icon">💬</div>
            {hovered && <div className="chat-message">Chat coming soon...</div>}
        </div>
    );
};

export default ChatBubble;
