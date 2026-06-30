import React, { useEffect, useState } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { FaGoogle } from 'react-icons/fa';
import { replace, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { gooeyToast } from 'goey-toast';
import api from '../api/api.js';

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
      const response = await api.post(
        '/api/auth/login',
        formData,
      );

      const data = response.data;

      handleLogin(data.token, data.user);
      gooeyToast.success('Success', {
        fillColor: '#FFFFFF',
        preset: 'bouncy',
      });
      navigate('/chat', { replace: true });
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Login Failed.';
      setError(errorMessage);
      gooeyToast.error('Error', {
        description: errorMessage,
        fillColor: '#FFFFFF',
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
        const response = await api.post(
          '/api/auth/googleLogin',
          {
            access_token: tokenResponse.access_token,
          },
        );

        const data = response.data;

        const userToken = data.token || 'dummy-token';
        handleLogin(userToken, data.user);
        gooeyToast.success('Success', {
          fillColor: '#FDF6ED',
          preset: 'bouncy',
        });
        navigate('/chat', { replace: true });
      } catch (error) {
        const errorMessage =
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Login Failed.';
        setError(errorMessage);
        gooeyToast.error('Error', {
          description: errorMessage,
          fillColor: '#FDF6ED',
          preset: 'bouncy',
        });
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Login using google is canceled ');
    },
  });

  

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF2E9]">
      <AuthHeader
        altText="Don't have an account?"
        altAction="/signup"
        altLabel="Sign Up"
      />

      <main className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          <div>
            <h1 className="font-sg text-[34px] font-extrabold tracking-tight mb-1.5 text-black">
              Welcome back!
            </h1>
            <p className="text-[#555] text-[15px] font-dm">
              Ready to jump back into the conversation?
            </p>
          </div>

          <div className="p-9 bg-white border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="flex flex-col gap-5">
              <form
                onSubmit={handleManualLogin}
                className="flex flex-col gap-[18px]">
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

                <div className="text-right">
                  <a
                    href="/reset-password"
                    className="font-dm text-[12px] text-[#1933CC] underline hover:text-black transition-colors duration-150">
                    Forgot Password?
                  </a>
                </div>

                <Btn
                  full
                  type="submit"
                  disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Btn>
              </form>

              <div className="border-t-2 border-black pt-5 mt-2">
                <Btn
                  v="ghost"
                  full
                  type="button"
                  onClick={() => handleLoginGoogle()}
                  disabled={loading}>
                  <div className="flex items-center justify-center gap-2">
                    <FaGoogle className="text-[#4285F4] text-[16px]" />
                    <span>
                      {loading ? 'Connecting...' : 'Continue with Google'}
                    </span>
                  </div>
                </Btn>
              </div>
            </div>
          </div>

          <p className="text-center text-[14px] text-[#555] font-dm">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#1933CC] font-bold bg-transparent border-none cursor-pointer underline font-mono text-[13px] hover:text-black transition-colors duration-150">
              Sign Up
            </button>
          </p>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
