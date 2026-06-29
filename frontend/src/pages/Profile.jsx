import React, { useState, useEffect } from 'react';
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { SelectField } from '../components/SelectField.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { useContext } from 'react';
import { getCodeList } from 'country-list';
import axios from 'axios';

export default function Profile() {
  const navigate = useNavigate();
  const countryObject = getCodeList();
  const { user, setUser } = useContext(AuthContext);
  const myId = user?.id || user._id;

  const [formData, setFormData] = useState({
    username: '',
    age: '',
    gender: '',
    country: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!myId) return;

      try {
        const response = await axios.get(
          `http://localhost:4000/api/auth/getUser/${myId}`,
        );
        const userData = response.data.user || response.data;

        setFormData({
          username: userData.username || '',
          age: userData.age || '',
          gender: userData.gender || 'Male',
          country: userData.country || '',
        });
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };

    fetchProfile();
  }, [myId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put(
        `http://localhost:4000/api/auth/update/${myId}`,
        formData,
      );

      setMessage({ type: 'success', text: 'Profile Successfully Updated! ' });

      if (setUser) {
        setUser(response.data.user || { ...user, ...formData });
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed Update Profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed Update Profile! ',
      });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen flex flex-col bg-[#F4D738] font-sans selection:bg-[#FFE04B]">
  <header className="border-b-3 border-[#0D0C0C] px-6 bg-white shrink-0">
    <div className="flex items-center justify-between h-14 max-w-[1200px] mx-auto w-full">
      <button
        onClick={() => navigate('/chat')}
        className="text-[16px] font-black bg-transparent border-none cursor-pointer text-[#0D0C0C] flex items-center gap-2 outline-none hover:opacity-80 transition-opacity"
      >
        Back
      </button>
    </div>
  </header>

  <main className="flex-1 flex items-center justify-center py-10 px-5">
    <div className="bg-white border-3 border-[#0D0C0C] shadow-[6px_6px_0_0_#0D0C0C] w-full max-w-[500px] p-[30px] flex flex-col gap-5 rounded-none">
      
      <div className="text-center mb-2.5">
        <h2 className="text-[24px] m-0 text-[#0D0C0C] font-sg font-black uppercase tracking-tight">
          Your Profile
        </h2>
      </div>

      {message.text && (
        <div
          className={`p-3 border-2 border-dashed border-[#0D0C0C] text-[#0D0C0C] font-bold text-center text-[14px] ${
            message.type === 'success' ? 'bg-[#00C27C]' : 'bg-[#FFD1DC]'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[13px] text-[#0D0C0C] font-dm uppercase tracking-wider">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 border-2 border-[#0D0C0C] bg-white text-[#0D0C0C] font-dm text-[14px] outline-none shadow-[3px_3px_0_0_#0D0C0C] focus:bg-[#DAF5F0] transition-colors rounded-none"
            placeholder="username"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            <label className="font-bold text-[13px] text-[#0D0C0C] font-dm uppercase tracking-wider">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="10"
              max="100"
              className="p-3 border-2 border-[#0D0C0C] bg-white text-[#0D0C0C] font-dm text-[14px] outline-none shadow-[3px_3px_0_0_#0D0C0C] focus:bg-[#DAF5F0] transition-colors rounded-none"
              placeholder="Contoh: 21"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
            <label className="font-bold text-[13px] text-[#0D0C0C] font-dm uppercase tracking-wider">
              Gender
            </label>
            <SelectField
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              opts={[
                { v: '', l: 'Select your gender', d: true },
                { v: 'male', l: 'Male' },
                { v: 'female', l: 'Female' },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-bold text-[13px] text-[#0D0C0C] font-dm uppercase tracking-wider">
            Country
          </label>
          <SelectField
            id="country"
            value={formData.country}
            onChange={handleChange}
            opts={finalCountryOptions}
          />
        </div>

        <Btn
          type="submit"
          disabled={isLoading}
          className="mt-2.5 h-[48px] bg-[#00C27C] !text-[#0D0C0C] text-[16px] font-black font-sg uppercase tracking-wide"
        >
          {isLoading ? 'Save...' : 'Save Changes'}
        </Btn>

      </form>
    </div>
  </main>
</div>
  );
}
