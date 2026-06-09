import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="custom-sidebar">
      <h2 className="custom-sidebar-title">Expense Tracker</h2>
      <ul className="custom-sidebar-menu">
        <li>
          <NavLink to="/home/add-income" className="custom-sidebar-link">
            Add Income
          </NavLink>
        </li>
        <li>
          <NavLink to="/home/add-expenses" className="custom-sidebar-link">
            Add Expenses
          </NavLink>
        </li>
        <li>
          <NavLink to="/home/set-goal" className="custom-sidebar-link">
            Set Goal
          </NavLink>
        </li>
        <li>
          <NavLink to="/home/expense-report" className="custom-sidebar-link">
            Expense Report
          </NavLink>
        </li>
        <li>
          <NavLink to="/home/dashboard" className="custom-sidebar-link">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/home/profile" className="custom-sidebar-link">
            Profile
          </NavLink>
        </li>
        <li>
          <button className="custom-sidebar-logout" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
