import React, { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, type: 'user' };
      setMessages([...messages, userMessage]);
      setInput('');

      const botResponse = await fetchModelResponse(input);
      if (botResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, type: 'bot' },
        ]);
      }
    }
  };

  const fetchModelResponse = async (userInput) => {
    const url = 'https://ai-llama-forwarder.pawankumar-b2020.workers.dev/';
  
    const data = {
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: userInput }
      ]
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const jsonResponse = await response.json();
      console.log('JSON Response:', jsonResponse);
  
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
    <div className="flex flex-col h-full mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-blue-600">
        <h1 className="text-white font-bold">AI Chatbot</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
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
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
