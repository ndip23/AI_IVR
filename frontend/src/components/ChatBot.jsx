import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatBot() {
  const [sessionId, setSessionId] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your virtual support agent. How can I assist you with your orders today?' }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => { setSessionId(uuidv4()); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { sessionId, message: userMsg });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: '⚠️ Server connection failed.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[600px] border border-gray-200">
      <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
        <Bot size={24} className="text-white" />
        <h2 className="text-white font-semibold text-lg">AI Support Agent</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
            <div className={`p-3 rounded-2xl text-[15px] shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border rounded-bl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="self-start bg-white border p-3 rounded-2xl rounded-bl-none text-gray-500 shadow-sm animate-pulse">Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
}