import React, { useState } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { gooeyToast } from 'goey-toast';
import axios from 'axios';


export default function LoginPage() {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', formData);

      const data = response.data;

      handleLogin(data.token, data.user);
      gooeyToast.success('Success', {
        fillColor: '#FDF6ED',
        preset: 'bouncy',
      });
      navigate('/chat');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Gagal login.';
      setError(errorMessage);
      gooeyToast.error('Error', {
        description: errorMessage,
        fillColor: '#FDF6ED',
        preset: 'bouncy',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          'http://localhost:4000/api/auth/googleLogin',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: tokenResponse.access_token }),
          },
        );

        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || 'Failed Login With Google');

        const userToken = data.token || 'dummy-token';
        handleLogin(userToken, data.user);

        navigate('/chat');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Login using goole is canceled ');
    },
  });
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: C.paper,
      }}>
      <AuthHeader
        altText="Don't have an account?"
        altAction="/signup"
        altLabel="Sign Up"
      />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 40,
        }}>
        <div
          style={{
            width: '100%',
            maxWidth: 440,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}>
          <div>
            <div
              className="dm"
              style={{
                fontSize: 11,
                letterSpacing: '.08em',
                color: '#888',
                marginBottom: 6,
              }}></div>
            <h1
              className="sg"
              style={{
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: '-.03em',
                marginBottom: 6,
              }}>
              Welcome back! 👋
            </h1>
            <p style={{ color: '#555', fontSize: 15 }}>
              Ready to jump back into the conversation?
            </p>
          </div>
          <div
            className="nb"
            style={{ padding: 36, background: C.white }}>
            <div
              style={{
                height: 5,
                background: C.blue,
                margin: '-36px -36px 32px -36px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <form
                onSubmit={handleManualLogin}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Field
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Field
                  label="Password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div style={{ textAlign: 'right' }}>
                  <a
                    href="/reset-password"
                    className="dm"
                    style={{
                      fontSize: 12,
                      color: C.blue,
                      textDecoration: 'underline',
                    }}>
                    Forgot Password?
                  </a>
                </div>
                <Btn
                  full
                  type="submit"
                  disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In →'}
                </Btn>
              </form>

              <div style={{ borderTop: `2px solid ${C.ink}`, paddingTop: 20 }}>
                <Btn
                  v="ghost"
                  full
                  type="button"
                  onClick={() => handleLoginGoogle()}
                  disabled={loading}>
                  <FaGoogle style={{ color: '#4285F4', fontSize: 16 }} />
                  {loading ? 'Connecting...' : 'Continue with Google'}
                </Btn>
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                color: C.blue,
                fontWeight: 700,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'DM Mono',
                fontSize: 13,
              }}>
              Sign Up
            </button>
          </p>
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}
