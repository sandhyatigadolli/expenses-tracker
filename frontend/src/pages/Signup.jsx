import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Simple client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2)
      newErrors.fullName = 'Name must be at least 2 characters';

    if (!formData.email.trim())
      newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Please enter a valid email';

    if (formData.phone && !/^[+]?[\d\s-()]+$/.test(formData.phone))
      newErrors.phone = 'Please enter a valid phone number';

    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Signup POST
  // in src/pages/Signup.jsx
const handleSignup = async () => {
  if (!validateForm()) return;

  try {
    const res = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch {}

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } else {
      const msg =
        (data && (data.message || data.error || data.detail)) ||
        `${res.status} ${res.statusText}`;
      setErrors({ submit: msg });
    }
  } catch (err) {
    setErrors({ submit: "Network or server error. Please try again." });
  }
};


  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Box sx={{ width: '90%', maxWidth: 450, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 0, textAlign: 'center' }}>
          <h1 className="title">Expense Tracker</h1>
        </Box>
        <Box
          sx={{
            p: 3,
            backgroundColor: '#fff',
            borderRadius: 3,
            boxShadow: 3,
            maxHeight: '70vh',
            overflowY: 'auto'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Sign Up
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting...
            </Alert>
          )}

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <TextField
            label="Full Name *"
            fullWidth
            size="small"
            value={formData.fullName}
            onChange={e => handleInputChange('fullName', e.target.value)}
            error={!!errors.fullName}
            helperText={errors.fullName}
            sx={{ mb: 1.5 }}
          />

          <TextField
            label="Email Address *"
            type="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 1.5 }}
          />

          <TextField
            label="Phone Number"
            fullWidth
            size="small"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone || "Optional"}
            placeholder="+91 9876543210"
            sx={{ mb: 1.5 }}
          />

          <TextField
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            size="small"
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password || "Minimum 6 characters"}
            sx={{ mb: 1.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            label="Confirm Password *"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            size="small"
            value={formData.confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSignup}
            disabled={success}
            sx={{
              backgroundColor: '#2979ff',
              py: 1.2,
              mb: 2,
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            {success ? 'CREATING ACCOUNT...' : 'SIGN UP'}
          </Button>

          <Typography variant="body2">
            Already have an account?{' '}
            <span
              style={{ color: 'purple', cursor: 'pointer' }}
             onClick={async () => {
  try {
    await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.log("Logout skipped");
  }

  navigate('/login');
}}
            >
              Login here
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
