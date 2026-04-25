import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import Profile from './components/Profile';

function AppContent() {
  const { user, setUser, loading } = useAuth();
  const [view, setView] = useState('login'); // login, register, chat, profile

  // Sync view with auth state
  React.useEffect(() => {
    if (user) {
      if (view === 'login' || view === 'register') {
        setView('chat');
      }
    } else {
      setView('login');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {view === 'login' && (
        <Login onToggleMode={() => setView('register')} />
      )}
      
      {view === 'register' && (
        <Register onToggleMode={() => setView('login')} />
      )}

      {view === 'chat' && user && (
        <Chat 
          user={user} 
          setAuth={setUser} 
          onProfileClick={() => setView('profile')} 
        />
      )}

      {view === 'profile' && user && (
        <Profile onBackToChat={() => setView('chat')} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
