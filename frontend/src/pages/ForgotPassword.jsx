import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {

    const res = await fetch(
      "http://localhost:8080/api/auth/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          newPassword
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      setMessage(data.message);
    }
  };

  return (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2
    }}
  >
    <Box sx={{ width: "100%", maxWidth: 400, textAlign: "center" }}>

      <Typography
        variant="h3"
        component="h1"
        sx={{
          mb: 3,
          fontWeight: "bold",
          color: "#060606"
        }}
      >
        Expense Tracker
      </Typography>

      <Box
        sx={{
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: 3
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 2
          }}
        >
          Reset Password
        </Typography>

        {message && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        <TextField
          label="Email Address"
          fullWidth
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />

       <TextField
  label="New Password"
  type={showPassword ? "text" : "password"}
  fullWidth
  size="small"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  sx={{ mb: 2 }}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword(!showPassword)}
          edge="end"
          size="small"
        >
          {showPassword ? (
            <VisibilityOff />
          ) : (
            <Visibility />
          )}
        </IconButton>
      </InputAdornment>
    )
  }}
/>

        <Button
          variant="contained"
          fullWidth
          onClick={handleReset}
          sx={{
            backgroundColor: "#2979ff",
            py: 1.2,
            mb: 2,
            "&:hover": {
              backgroundColor: "#1565c0"
            }
          }}
        >
          RESET PASSWORD
        </Button>

        <Typography variant="body2">
          Remember your password?{" "}
          <span
            style={{
              color: "purple",
              cursor: "pointer"
            }}
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </Typography>

      </Box>
    </Box>
  </Box>
);
}