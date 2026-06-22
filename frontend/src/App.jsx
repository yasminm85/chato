import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layouts.jsx';
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import { useContext } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GooeyToaster, gooeyToast } from 'goey-toast';
import 'goey-toast/styles.css';

export default function App() {
  function ProtectedRoute({ children }) {
    const { token, user } = useContext(AuthContext);
    if (!token || !user) {
      return (
        <Navigate
          to="/login"
          replace
        />
      );
    }
    return children;
  }

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
              element={<SignupPage />}
            />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-email/:token"
              element={<VerifyEmail />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
