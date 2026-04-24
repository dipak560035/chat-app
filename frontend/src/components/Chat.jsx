import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, Users, MessageSquare, LogOut } from 'lucide-react';

const Chat = ({ user, setAuth }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalMessages: 0 });
  const [notifications, setNotifications] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join room
    newSocket.emit('join', { username: user.username });

    // Initial data fetch
    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [msgRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/messages', config),
          axios.get('http://localhost:5000/api/users/stats')
        ]);
        setMessages(msgRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();

    // Socket events
    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('userJoined', (data) => {
      setNotifications((prev) => [...prev, data.message]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter(n => n !== data.message));
      }, 5000);
    });

    newSocket.on('statsUpdate', (newStats) => {
      setStats((prev) => ({ ...prev, ...newStats }));
    });

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('sendMessage', {
        sender: user._id,
        username: user.username,
        text: newMessage
      });
      setNewMessage('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setAuth(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-blue-600">RealTime Chat</h1>
          <div className="flex space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{stats.totalUsers} Users</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              <span>{stats.totalMessages} Messages</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Hi, {user.username}</span>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col space-y-2">
        {notifications.map((note, index) => (
          <div key={index} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out text-sm">
            {note}
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex ${msg.username === user.username ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                msg.username === user.username
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              {msg.username !== user.username && (
                <p className="text-xs font-bold mb-1 text-blue-500">{msg.username}</p>
              )}
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.username === user.username ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Box */}
      <footer className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex space-x-4">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;
