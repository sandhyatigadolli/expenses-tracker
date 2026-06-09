import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const successLogin = await login(formData.email, formData.password);
      if (successLogin) {
        setSuccess(true);
        setTimeout(() => navigate('/home/dashboard', { replace: true }), 500);
      } else {
        setErrors({ submit: 'Invalid credentials' });
      }
    } catch {
      setErrors({ submit: 'Server error. Please try again.' });
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
      <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ mb: 3, fontWeight: 'bold', color: '#060606ff' }}
        >
          Expense Tracker
        </Typography>

        <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Login
          </Typography>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Login successful! Redirecting to dashboard...
            </Alert>
          )}

          {errors.submit && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.submit}
            </Alert>
          )}

          <TextField
            label="Email Address *"
            type="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}

            autoFocus
          />

          <TextField
            label="Password *"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            size="small"
            value={formData.password}
            onChange={e => handleInputChange('password', e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Typography
  variant="body2"
  sx={{
    color: "#1976d2",
    cursor: "pointer",
    textAlign: "right",
    mb: 2
  }}
  onClick={() => navigate("/forgot-password")}
>
  Forgot Password?
</Typography>


          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                size="small"
                color="primary"
              />
            }
            label="Remember Me"
            sx={{ mb: 2, justifyContent: 'flex-start', display: 'flex' }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            disabled={success}
            sx={{
              backgroundColor: '#2979ff',
              py: 1.2,
              mb: 2,
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            {success ? 'LOGGING IN...' : 'LOGIN'}
          </Button>

          <Typography variant="body2">
            Don't have an account?{' '}
            <span
              style={{ color: 'purple', cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Signup here
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
