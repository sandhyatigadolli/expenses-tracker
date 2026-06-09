// src/pages/ExpenseReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Grid,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";



// ---------- Helpers ----------
const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(
    Number(n || 0)
  );


const getCategory = (exp) =>
  (exp?.category ??
    exp?.Category ??
    exp?.type ??
    exp?.expenseType ??
    exp?.label ??
    exp?.name ??
    "Other")?.toString?.().trim() || "Other";


const getAmount = (exp) => Number(exp?.amount ?? exp?.value ?? exp?.price ?? 0);


const getDate = (exp) =>
  exp?.startDate || exp?.date || exp?.createdAt || exp?.endDate || null;


const monthKey = (isoDateLike) => {
  const d = new Date(isoDateLike);
  if (Number.isNaN(d.valueOf())) return null;
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
};


const PALETTE = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#AF19FF", "#FF4560", "#775DD0", "#26a69a",
  "#d4526e", "#2b908f", "#e83e8c", "#4caf50",
  "#3f51b5", "#ff9800", "#9c27b0", "#009688"
];


const buildCategoryColors = (categories) => {
  const map = new Map();
  categories.forEach((cat, idx) => {
    if (idx < PALETTE.length) {
      map.set(cat, PALETTE[idx]);
    } else {
      const hue = Math.round((idx * 137.508) % 360);
      map.set(cat, `hsl(${hue} 70% 50%)`);
    }
  });
  return map;
};


export default function ExpenseReport() {

const { user } = useContext(AuthContext);
const userId = user?.id || user?.userId;
  const [expenses, setExpenses] = useState([]);
  const [predictedNextMonth, setPredictedNextMonth] = useState(null);
  const [filteredCategory, setFilteredCategory] = useState(null);

useEffect(() => {
  if (!userId) return;

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/expenses/user/${userId}`
      );
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  fetchExpenses();
}, [userId]);

  const categoryData = useMemo(() => {
    const sums = new Map();
    expenses.forEach((exp) => {
      const cat = getCategory(exp);
      const amt = getAmount(exp);
      sums.set(cat, (sums.get(cat) || 0) + amt);
    });
    return Array.from(sums.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);


  const filteredData =
    filteredCategory === null
      ? categoryData
      : categoryData.filter((d) => d.name === filteredCategory);


  const categoryColorMap = useMemo(
    () => buildCategoryColors(categoryData.map((d) => d.name)),
    [categoryData]
  );


  useEffect(() => {
    const monthTotals = new Map();
    expenses.forEach((exp) => {
      const d = getDate(exp);
      const key = d ? monthKey(d) : null;
      if (!key) return;
      monthTotals.set(key, (monthTotals.get(key) || 0) + getAmount(exp));
    });


    const sorted = Array.from(monthTotals.entries())
      .sort((a, b) => new Date(a[0] + "-01") - new Date(b + "-01"))
      .map(([, val]) => val);


    if (sorted.length < 2) {
      setPredictedNextMonth(null);
      return;
    }


    const n = sorted.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = sorted;


    const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const meanX = mean(x);
    const meanY = mean(y);


    let num = 0, den = 0;
    for (let i = 0; i < n; i++) {
      num += (x[i] - meanX) * (y[i] - meanY);
      den += (x[i] - meanX) ** 2;
    }
    const b = den === 0 ? 0 : num / den;
    const a = meanY - b * meanX;


    const yNext = Math.max(0, a + b * n);
    setPredictedNextMonth(Number(yNext.toFixed(2)));
  }, [expenses]);


  const total = useMemo(
    () => expenses.reduce((s, e) => s + getAmount(e), 0),
    [expenses]
  );


  const toggleCategory = (category) => {
    setFilteredCategory((prev) => (prev === category ? null : category));
  };


  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Expense Report
      </Typography>

      {/* Prediction Box at Center */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Paper sx={{ p: 2, minWidth: "60%", textAlign: "center" }}>
          {predictedNextMonth !== null ? (
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000000" }}>
              Predicted Next Month's Total: ₹{fmtINR(predictedNextMonth)}
            </Typography>
          ) : (
            <Typography variant="h6" color="text.secondary">
              Add expenses across at least two different months to see a prediction.
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Current total recorded: ₹{fmtINR(total)}
          </Typography>
        </Paper>
      </Box>

      {/* Two EXACTLY SAME SIZE cards */}
      <Box sx={{ display: "flex", gap: 3, height: "500px" }}>
        {/* Left card: All Expenses - SCROLLABLE TABLE */}
        <Box sx={{ flex: 1, height: "100%" }}>
          <Paper sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
              <Typography variant="h6">
                All Expenses
              </Typography>
            </Box>
            {/* SCROLLABLE CONTAINER - THIS IS THE KEY PART */}
            <Box sx={{ flex: 1, overflowY: "auto", maxHeight: "540px" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Category</b></TableCell>
                    <TableCell><b>Amount (₹)</b></TableCell>
                    <TableCell><b>Period</b></TableCell>
                    <TableCell><b>Start Date</b></TableCell>
                    <TableCell><b>End Date</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No expenses recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((exp, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{getCategory(exp)}</TableCell>
                        <TableCell>₹{fmtINR(getAmount(exp))}</TableCell>
                        <TableCell>{exp?.period || "-"}</TableCell>
                        <TableCell>{exp?.startDate || exp?.date || "-"}</TableCell>
                        <TableCell>{exp?.endDate || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Box>

        {/* Right card: Pie Chart - EXACTLY SAME SIZE */}
        <Box sx={{ flex: 1, height: "100%" }}>
          <Paper sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
              <Typography variant="h6">
                Expense Breakdown by Category
              </Typography>
            </Box>
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, value }) => `${name}: ₹${fmtINR(value)}`}
                    onClick={(d) => toggleCategory(d.name)}
                  >
                    {filteredData.map((d) => (
                      <Cell
                        key={d.name}
                        fill={categoryColorMap.get(d.name)}
                        cursor="pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${fmtINR(val)}`} />
                  <Legend
                    onClick={(e) => toggleCategory(e.value)}
                    wrapperStyle={{ cursor: "pointer" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}
