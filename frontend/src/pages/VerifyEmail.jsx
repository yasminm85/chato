import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { C } from '../components/Button.jsx';

export default function VerifyEmail() {
  const { token } = useParams(); // Ambil token dari URL
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, atau error

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`http://localhost:4000/api/auth/verify-email/${token}`);
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h2 className="sg">Memverifikasi Akun...</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>Tunggu sebentar ya, akun kamu lagi divalidasi.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
            <h2 className="sg" style={{ color: C.green }}>Verifikasi Sukses!</h2>
            <p style={{ color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
              Email kamu berhasil diverifikasi. Halaman bakal otomatis pindah ke Login dalam 3 detik...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h2 className="sg" style={{ color: '#FF3333' }}>Verifikasi Gagal!</h2>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Link salah atau token sudah kedaluwarsa. Silakan coba register ulang atau hubungi bantuan.
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
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}