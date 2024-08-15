// src/App.jsx
import React from 'react';
import Chatbot from './components/Chatbot';
import './index.css'; // Ensure Tailwind CSS is imported

const App = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Chatbot />
    </div>
  );
};

export default App;
