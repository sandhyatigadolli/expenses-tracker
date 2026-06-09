


import React, { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaPlusCircle,
  FaMinusCircle,
  FaBullseye,
  FaChartPie,
  FaTachometerAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { Divider } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

function DashboardLayout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9f9f9" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          background: "#1e1e2f",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "2px",
              fontSize: "20px",
            }}
          >
            <span style={{ fontSize: "30px" }}>E</span>xpense{" "}
            <span style={{ fontSize: "30px" }}>T</span>racker
          </h2>

          <Divider
            style={{
              backgroundColor: "white",
              marginBottom: "2px",
              width: "170px",
              display: "flex",
              alignItems: "center",
            }}
          />
          <Divider
            style={{
              backgroundColor: "white",
              marginBottom: "20px",
              width: "220px",
              display: "flex",
              alignItems: "center",
            }}
          />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <NavLink
            to="/home/add-income"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: isActive ? "#00d4ff" : "white",
              background: isActive ? "#2a2a3d" : "transparent",
              textDecoration: "none",
              gap: "10px",
            })}
          >
            <FaPlusCircle /> Add Income
          </NavLink>

          <NavLink
            to="/home/add-expenses"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: isActive ? "#00d4ff" : "white",
              background: isActive ? "#2a2a3d" : "transparent",
              textDecoration: "none",
              gap: "10px",
            })}
          >
            <FaMinusCircle /> Add Expenses
          </NavLink>

          <NavLink
            to="/home/set-goal"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: isActive ? "#00d4ff" : "white",
              background: isActive ? "#2a2a3d" : "transparent",
              textDecoration: "none",
              gap: "10px",
            })}
          >
            <FaBullseye /> Set Goal
          </NavLink>

          <NavLink
            to="/home/expense-report"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: isActive ? "#00d4ff" : "white",
              background: isActive ? "#2a2a3d" : "transparent",
              textDecoration: "none",
              gap: "10px",
            })}
          >
            <FaChartPie /> Expense Report
          </NavLink>

          <NavLink
            to="/home/dashboard"
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: isActive ? "#00d4ff" : "white",
              background: isActive ? "#2a2a3d" : "transparent",
              textDecoration: "none",
              gap: "10px",
            })}
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>

        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "20px",
            padding: "12px",
            background: "#e63946",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            gap: "10px",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Content Area */}
      <main style={{ flex: 1, padding: "30px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout; 


