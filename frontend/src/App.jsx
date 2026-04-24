import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';

function App() {
  const [auth, setAuth] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setAuth(JSON.parse(userInfo));
    }
  }, []);

  if (auth) {
    return <Chat user={auth} setAuth={setAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLogin ? (
        <>
          <Login setAuth={setAuth} />
          <div className="text-center pb-8 -mt-16">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-blue-600 font-bold hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          <Register setAuth={setAuth} />
          <div className="text-center pb-8 -mt-16">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
