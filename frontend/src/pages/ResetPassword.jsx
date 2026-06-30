import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Btn, { C } from '../components/Button.jsx';
import { Field } from '../components/Fields.jsx';
import { AuthHeader, AuthFooter } from '../components/Layouts.jsx';
import { ErrorMsg } from "../components/reset-password/ErrorMsg.jsx";
import { Header } from "../components/reset-password/Header.jsx";
import { ProgressBar } from "../components/reset-password/Progress";
import api from "../api/api.js";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmited, setIsOtpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const inputRefs = useRef([]);


  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    if (!email) return setError("Input Your Email");

    setLoading(true);
    try {
      const response = await api.post('/api/auth/send-otp', {email});
      const data = response.data;
      
      
      setMsg("OTP Send To Your Email!");
      setIsEmailSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return setError("Input Your OTP");

    setLoading(true);
    
    try {
      const response = await api.post('/api/auth/verify-otp', {
        email,
        otp: otpCode
      });

      const data = response.data;

      setMsg('Otp Verified');
      setIsOtpSubmitted(true);
    } catch (error) {
        setError('Otp Invalid', error.message);
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMsg('');

    if (newPassword !== confirmPassword) return setError("Password dan confirmation are not match.");
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError("Must be contain lower, capital, number, and symbol.");
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/reset', {
        email, otp: otp.join(""), newPassword
      });
      const data = response.data;

      setMsg("Password has been changed! Turn to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val !== "" && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const currentStep = !isEmailSent ? 1 : !isOtpSubmited ? 2 : 3;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.paper }}>
      <AuthHeader altText="Remember your password?" altAction="/login" altLabel="Sign In" />
      
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>
          
          <Header isEmailSent={isEmailSent} isOtpSubmited={isOtpSubmited} />

          <div className="nb" style={{ padding: 36, background: C.white }}>
            <div style={{ height: 5, background: C.blue, margin: "-36px -36px 32px -36px" }} />
            
            <ErrorMsg error={error} msg={msg} />

            {/* FORM 1: EMAIL */}
            {!isEmailSent && (
              <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="Email Address" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" />
                <Btn full type="submit" disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP Code'}</Btn>
              </form>
            )}

            {isEmailSent && !isOtpSubmited && (
              <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
                  {otp.map((digit, index) => (
                    <input
                      key={index} type="text" maxLength="1" value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      className="inp" 
                      style={{ padding: 0, width: 48, height: 48, textAlign: "center", fontSize: 20, fontWeight: "bold" }}
                    />
                  ))}
                </div>
                <Btn full type="submit" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</Btn>
                <Btn full v="ghost" type="button" onClick={() => { setIsEmailSent(false); setOtp(new Array(6).fill("")); setError(''); setMsg(''); }}>Back</Btn>
              </form>
            )}

            {isEmailSent && isOtpSubmited && (
              <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <Field label="New Password" type="password" id="newPw" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                <Field label="Confirm Password" type="password" id="confPw" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                <Btn full type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Btn>
                <Btn full v="ghost" type="button" onClick={() => { setIsOtpSubmitted(false); setError(''); setMsg(''); }}>Back</Btn>
              </form>
            )}

            <ProgressBar currentStep={currentStep} />
          </div>

        </div>
      </main>
      <AuthFooter />
    </div>
  );
}