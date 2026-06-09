import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import axios from "axios";

export default function AddIncome() {
  const { user } = useContext(AuthContext);
const userId = user?.id || user?.userId;
  const [amount, setAmount] = useState("");
  const [incomeType, setIncomeType] = useState("");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customIncomeType, setCustomIncomeType] = useState("");
  const [success, setSuccess] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Fetch all incomes on component mount
useEffect(() => {
  if (userId) fetchIncomes();
}, [userId]);

  const fetchIncomes = async () => {
    try {
      // const res = await axios.get("http://localhost:8080/api/incomes");
      const res = await axios.get(`http://localhost:8080/api/incomes/user/${userId}`);
      setIncomes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartDateChange = (e) => {
    const start = new Date(e.target.value);
    setStartDate(e.target.value);

    if (period === "Weekly") {
      let end = new Date(start);
      end.setDate(start.getDate() + 6);
      setEndDate(end.toISOString().split("T")[0]);
    }

    if (period === "Monthly") {
      let end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      end.setDate(end.getDate() - 1);
      setEndDate(end.toISOString().split("T")[0]);
    }
  };

  const handleAddOrUpdateIncome = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !incomeType || !period || !startDate || !endDate) {
      alert("Please fill all fields correctly!");
      return;
    }

    const incomeData = {
      amount: Number(amount),
      incomeType: incomeType === "Other" ? customIncomeType : incomeType,
      period,
      startDate,
      endDate,
        userId: userId,
    };

    try {
      if (editIndex !== null && incomes[editIndex].id) {
        // Update
        await axios.put(`http://localhost:8080/api/incomes/${incomes[editIndex].id}`, incomeData);
      } else {
        // Add
        await axios.post("http://localhost:8080/api/incomes", incomeData);
      }

      await fetchIncomes();

      setAmount("");
      setIncomeType("");
      setCustomIncomeType("");
      setPeriod("");
      setStartDate("");
      setEndDate("");
      setEditIndex(null);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to save income");
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/api/incomes/${incomes[index].id}`);
      await fetchIncomes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete income");
    }
  };

  const handleEdit = (index) => {
    const entry = incomes[index];
    setAmount(entry.amount);
    setIncomeType(entry.incomeType === "Other" ? "Other" : entry.incomeType);
    setCustomIncomeType(entry.incomeType === "Other" ? entry.incomeType : "");
    setPeriod(entry.period);
    setStartDate(entry.startDate);
    setEndDate(entry.endDate);
    setEditIndex(index);
  };

  return (
    <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 4 }}>
      
      {/* Left Card: Income Form */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", width: "35%" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Add Income
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Enter Amount *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth required />
          
          <TextField select label="Select Income Type *" value={incomeType} onChange={(e) => setIncomeType(e.target.value)} fullWidth required>
            <MenuItem value="Salary">Salary</MenuItem>
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          
          {incomeType === "Other" && <TextField label="Custom Income Type *" value={customIncomeType} onChange={(e) => setCustomIncomeType(e.target.value)} fullWidth required />}
          
          <TextField select label="Period *" value={period} onChange={(e) => setPeriod(e.target.value)} fullWidth required>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </TextField>
          
          <TextField type="date" label="Start Date *" InputLabelProps={{ shrink: true }} value={startDate} onChange={handleStartDateChange} fullWidth required />
          
          <TextField type="date" label="End Date *" InputLabelProps={{ shrink: true }} value={endDate} fullWidth disabled required />
          
          <Button variant="contained" color="primary" onClick={handleAddOrUpdateIncome} fullWidth>
            {editIndex !== null ? "Update Income" : "Add Income"}
          </Button>
          
          {success && <Alert severity="success">Income saved successfully!</Alert>}
        </Box>
      </Paper>

      {/* Right Card: Income Table */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: "16px", width: "60%", maxHeight: "70vh", overflowY: "auto" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Income Entries
        </Typography>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Period</b></TableCell>
                <TableCell><b>Start</b></TableCell>
                <TableCell><b>End</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomes.map((income, index) => (
                <TableRow key={income.id}>
                  <TableCell>{income.amount}</TableCell>
                  <TableCell>{income.incomeType}</TableCell>
                  <TableCell>{income.period}</TableCell>
                  <TableCell>{income.startDate}</TableCell>
                  <TableCell>{income.endDate}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={() => handleEdit(index)}><Edit /></IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(index)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

    </Container>
  );
}