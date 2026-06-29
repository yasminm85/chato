import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar, Footer } from './components/Layouts.jsx';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignupPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Profile from './pages/Profile.jsx';
import MaintenancePage from './pages/Maintenance.jsx';
import { useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GooeyToaster, gooeyToast } from 'goey-toast';
import 'goey-toast/styles.css';

function ProtectedRoute() {
  const { token } = useContext(AuthContext); // 🚀 Ambil dari Context biar reaktif!

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function RestrictedRoute() {
  const { token } = useContext(AuthContext); // 🚀 Ambil dari Context juga!

  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
}

export default function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  if (isMaintenance) return <MaintenancePage />;

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <GooeyToaster position="top-right" />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                  <Footer />
                </>
              }
            />

            <Route
              path="/signup"
              element={
                  <SignUpPage />
              }
            />

            <Route element={<RestrictedRoute />}>
              <Route
                path="/login"
                element={<LoginPage />}
              />
            </Route>

            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />

            <Route element={<ProtectedRoute />}>
              <Route
                path="/chat"
                element={<ChatPage />}
              />
            </Route>

            <Route
              path="/verify-email/:token"
              element={<VerifyEmail />}
            />

            <Route
              path="/profile"
              element={
                  <Profile />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
