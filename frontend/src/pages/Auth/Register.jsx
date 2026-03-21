 
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [step, setStep] = useState(1);  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const navigate = useNavigate();

   
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post("http://localhost:5000/api/auth/send-verification", { email });
      
      setSuccess("The verification code has been sent to your email address!");
      setStep(2);
      
       
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Verification code could not be sent.");
    } finally {
      setLoading(false);
    }
  };

 
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post("http://localhost:5000/api/auth/verify-code", {
        email,
        code: verificationCode
      });
      
      setSuccess("Email verified! Please enter your details.");
      setStep(3);
      
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

   
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        ...formData,
        email
      });
      
       
      localStorage.setItem("user", JSON.stringify(res.data));
      
      alert("Registration successful! You are being redirected to the store.");
      navigate("/");
      window.location.reload();
      
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

   
  const resendCode = async () => {
    if (countdown > 0) return;
    
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-verification", { email });
      setSuccess("New verification code sent!");
      setCountdown(60);
    } catch (err) {
      setError("Code could not be sent.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>
        {step === 1 && 'Create Account'}
        {step === 2 && 'Email Verification'}
        {step === 3 && 'Enter your information'}
      </h2>
      
     
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '4px', backgroundColor: step >= 1 ? '#28a745' : '#ddd' }} />
        <div style={{ flex: 1, height: '4px', backgroundColor: step >= 2 ? '#28a745' : '#ddd' }} />
        <div style={{ flex: 1, height: '4px', backgroundColor: step >= 3 ? '#28a745' : '#ddd' }} />
      </div>
      
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
      
      {step === 1 && (
        <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      )}
      
      {step === 2 && (
        <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p style={{ textAlign: 'center' }}>
            Enter the 6-digit code sent to {email}
          </p>
          <input
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength="6"
            required
            style={{ ...inputStyle, textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }}
          />
          <button type="submit" disabled={loading || verificationCode.length !== 6} style={buttonStyle}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>
          <button
            type="button"
            onClick={resendCode}
            disabled={countdown > 0 || loading}
            style={secondaryButtonStyle}
          >
            {countdown > 0 ? `${countdown} seconds later, try again` : "Resend Code"}
          </button>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ ...inputStyle, height: '80px' }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Saving..." : "Register and Start Shopping"}
          </button>
        </form>
      )}
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Do you already have an account? <span onClick={() => navigate('/login')} style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
      </p>
    </div>
  );
};

const inputStyle = {
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '16px'
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};

const secondaryButtonStyle = {
  padding: '10px',
  backgroundColor: 'transparent',
  color: '#007bff',
  border: '1px solid #007bff',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

export default Register;