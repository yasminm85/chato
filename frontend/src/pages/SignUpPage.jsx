import React, { useState } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { SelectField } from '../components/SelectField.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    country: 'ID',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(formData);

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must 8 character, with capital, lower, and symbol.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal mendaftar');
      }

      alert('Registrasi berhasil dilakukan');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: C.paper,
      }}>
      <AuthHeader
        altText="Already have an account?"
        altAction="/login"
        altLabel="Sign In"
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
              Join Chato
            </h1>
            <p style={{ color: '#555', fontSize: 15 }}>
              Begin your journey to connecting the world.
            </p>
          </div>
          <div
            className="nb"
            style={{ padding: 36, background: C.white }}>
            <div
              style={{
                height: 5,
                background: C.yellow,
                margin: '-36px -36px 32px -36px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <form
                onSubmit={handleRegister}
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {error && (
                  <div
                    style={{
                      color: 'red',
                      fontSize: 13,
                      background: '#ffe6e6',
                      padding: 10,
                      borderRadius: 4,
                    }}>
                    {error}
                  </div>
                )}
                <Field
                  label="Full Name"
                  id="username"
                  placeholder="Jane Doe"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Field
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="jane.doe@example.com"
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
                <Field
                  label="Age"
                  type="number"
                  id="age"
                  placeholder="20"
                  value={formData.age}
                  onChange={handleChange}
                />
                <SelectField
                  label="Gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  opts={[
                    { v: '', l: 'Select your gender', d: true },
                    { v: 'male', l: 'Male' },
                    { v: 'female', l: 'Female' },
                  ]}
                />
                <SelectField
                  label="Country"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    fontFamily: 'DM Sans',
                    fontSize: 14,
                    background: '#FFF',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  opts={[
                    { v: '', l: 'Select your country', d: true },
                    { v: 'ID', l: '🇮🇩 Indonesia' },
                    { v: 'JP', l: '🇯🇵 Japan' },
                    { v: 'SG', l: '🇸🇬 Singapore' },
                    { v: 'US', l: '🇺🇸 US' },
                    { v: 'MY', l: '🇲🇾 Malaysia' },
                  ]}
                />

                <div style={{ paddingTop: 8 }}>
                  <Btn
                    type="submit"
                    full
                    disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account →'}
                  </Btn>{' '}
                </div>
              </form>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
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
              Sign in here
            </button>
          </p>
        </div>
      </main>
      <AuthFooter />
    </div>
  );
}
