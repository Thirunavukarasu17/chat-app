import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingPage from './pages/SettingPage'
import SignupPage from './pages/SignupPage'
import { Navigate, Route, Routes , useRouteError} from 'react-router-dom'
import { useThemeStore } from "./store/useThemeStore";
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react';
import { Toaster } from "react-hot-toast";



const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers }=useAuthStore()
  const { theme } = useThemeStore();


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

    return (
      <div data-theme={theme} className="min-h-screen flex flex-col">
        <Navbar />
    
        {/* Content area that allows scrolling if needed */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
    
        <Toaster />
      </div>
    );    
  };
  export default App;