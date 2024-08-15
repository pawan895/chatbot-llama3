import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, type: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');
      setLoading(true);

      const botResponse = await fetchModelResponse(input);
      setLoading(false);

      if (botResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, type: 'bot' },
        ]);
      }
    }
  };

  const fetchModelResponse = async (userInput) => {
    const url = import.meta.env.VITE_API_URL;

    const data = {
      
      messages: [
        { role: "system", content: "You are a Pawan's AI Chatbot" },
        { role: "user", content: userInput }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const jsonResponse = await response.json();

      if (jsonResponse.choices && jsonResponse.choices.length > 0) {
        return jsonResponse.choices[0]?.message?.content || 'No response from the bot.';
      } else {
        return 'Unexpected response format.';
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return 'Sorry, there was a problem connecting to the server.';
    }
  };

  return (
    <div className="flex flex-col h-full min-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-blue-600">
        <h1 className="text-white text-xl font-bold">Pawan's AI Chatbot</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-lg text-sm ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md p-3 rounded-lg text-sm bg-gray-200 text-gray-700 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="bg-white p-4 border-t border-gray-200">
        <div className="flex">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
