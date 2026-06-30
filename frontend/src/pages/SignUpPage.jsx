import React, { useState } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { SelectField } from '../components/SelectField.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { useNavigate } from 'react-router-dom';
import { gooeyToast } from 'goey-toast';
import { getNames } from 'country-list';
import { getCodeList } from 'country-list';
import api from '../api/api.js';

export default function SignUpPage() {
  const navigate = useNavigate();
  const countries = getNames();
  const countryObject = getCodeList();

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

    try {
      const response = await api.post(
        '/api/auth/register',
        formData,
      );

      const data = response.data;

      gooeyToast.success('Success', {
        fillColor: '#FDF6ED',
        preset: 'bouncy',
      });
      navigate('/login');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Register Failed';
      setError(errorMessage);
      setTimeout(() => {
        gooeyToast.error('Error', {
          description: errorMessage,
          fillColor: '#FFFFFF',
          preset: 'bouncy',
        });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  const dynamicCountryOptions = Object.entries(countryObject).map(
    ([code, name]) => {
      return {
        v: code.toUpperCase(),
        l: name.charAt(0).toUpperCase() + name.slice(1),
      };
    },
  );
  const sortedCountries = dynamicCountryOptions.sort((a, b) =>
    a.l.localeCompare(b.l),
  );
  const finalCountryOptions = [
    { v: '', l: 'Select your country', d: true },
    ...sortedCountries,
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF2E9]">
      <AuthHeader
        altText="Already have an account?"
        altAction="/login"
        altLabel="Sign In"
      />

      <main className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-[440px] flex flex-col gap-6">
          <div>
            <h1 className="font-sg text-[34px] font-extrabold tracking-tight mb-1.5 text-black">
              Join Chato
            </h1>
            <p className="text-[#555] text-[15px] font-dm">
              Begin your journey to connecting the world
            </p>
          </div>

          <div className="p-9 bg-white border-4 border-black shadow-[6px_6px_0_0_#000]">
            <div className="flex flex-col gap-[18px]">
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-[18px]">

                <Field
                  label="Full Name"
                  id="username"
                  placeholder="Budi Dan"
                  value={formData.username}
                  onChange={handleChange}
                />

                <Field
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="budidan@example.com"
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
                  opts={finalCountryOptions}
                />

                <div className="pt-2">
                  <Btn
                    type="submit"
                    full
                    disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Btn>
                </div>
              </form>
            </div>
          </div>

          <p className="text-center text-[14px] text-[#555] font-dm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#1933CC] font-bold bg-transparent border-none cursor-pointer underline font-mono text-[13px] hover:text-black transition-colors duration-150">
              Sign in here
            </button>
          </p>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}
