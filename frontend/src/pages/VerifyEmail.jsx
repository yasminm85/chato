import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { C } from '../components/Button.jsx';
import api from '../api/api.js';

export default function VerifyEmail() {
  const { token } = useParams(); 
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get(`/api/auth/verify-email/${token}`);
        setStatus('success');
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    if (token) verifyToken();
  }, [token, navigate]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: C.paper
    }}>
      <div className="nb" style={{
        padding: '30px 40px',
        background: '#FFF',
        border: '3px solid #000',
        boxShadow: '6px 6px 0px #000',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        {status === 'loading' && (
          <div>
            <h2 className="sg">Account Verification...</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Please wait</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 className="sg" style={{ color: C.green }}>Success Verification!</h2>
            <p style={{ color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
              Page will return back in 3 seconds....
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <h2 className="sg" style={{ color: '#FF3333' }}>Failed Verification!</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Link or Token Expired. Please Repeat SignUp
            </p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                border: '2px solid #000',
                background: C.yellow,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '2px 2px 0 #000'
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}