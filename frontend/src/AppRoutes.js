import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './pages/DashboardLayout';
import AddIncome from './pages/AddIncome';
import AddExpenses from './pages/AddExpenses';
import SetGoal from './pages/SetGoal';
import Dashboard from './pages/Dashboard';
import ExpenseReport from './pages/ExpenseReport';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from "./pages/ForgotPassword";

export default function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>

      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>


      <Route
        path="/home"
        element={
          user ? (
            <DashboardLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        {/* Default page after login */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard */}
        <Route
          path="dashboard"
          element={<Dashboard userId={user?.userId || user?.id} />}
        />

        {/* Other pages */}
        <Route path="add-income" element={<AddIncome />} />
        <Route path="add-expenses" element={<AddExpenses />} />
        <Route path="set-goal" element={<SetGoal />} />
        <Route path="expense-report" element={<ExpenseReport />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}