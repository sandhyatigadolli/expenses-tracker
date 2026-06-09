import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [customExpenseType, setCustomExpenseType] = useState("");
  const [period, setPeriod] = useState(localStorage.getItem("incomePeriod") || "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [incomeStartDate,setIncomeStartDate]= useState("");
  const [incomeEndDate,setIncomeEndDate]= useState("");
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const userId = user?.userId || user?.id;

  const API_URL = "http://localhost:8080/api/expenses";
  const INCOME_API = "http://localhost:8080/api/incomes";

  const fetchExpenses = async () => {
  if (!userId) return;

  try {
    const response = await axios.get(
      `${API_URL}/user/${userId}`
    );

    setExpenses(response.data);
  } catch (err) {
    console.error(
      "Error fetching expenses:",
      err
    );
  }
};

const fetchLatestIncome = async () => {
  if (!userId) return;

  try {
    const response = await axios.get(
      `${INCOME_API}/user/${userId}`
    );

    const incomes = response.data;

  if (incomes.length > 0) {

  const latestIncome =
    incomes[incomes.length - 1];

  setPeriod((prev) =>
    prev ||
    latestIncome.period ||
    ""
  );

  setIncomeStartDate(
    latestIncome.startDate
  );

  setIncomeEndDate(
    latestIncome.endDate
  );
}
  } catch (err) {
    console.error(
      "Error fetching income:",
      err
    );
  }
};

useEffect(() => {

  if (userId) {

    fetchExpenses();

    fetchLatestIncome();
  }

}, [userId]);


useEffect(() => {

  if (
    !period ||
    !incomeStartDate
  ) return;

  const baseDate =
    new Date(
      incomeStartDate
    );

  // ===== WEEKLY =====
  if (period === "Weekly") {

    const start =
      new Date(baseDate);

    const day =
      start.getDay();

    const diff =
      day === 0
      ? -6
      : 1 - day;

    start.setDate(
      start.getDate() + diff
    );

    const end =
      new Date(start);

    end.setDate(
      start.getDate() + 6
    );

    setStartDate(
      start
      .toISOString()
      .split("T")[0]
    );

    setEndDate(
      end
      .toISOString()
      .split("T")[0]
    );
  }

  // ===== MONTHLY =====
  if (period === "Monthly") {

    setStartDate(
      incomeStartDate
    );

    setEndDate(
      incomeEndDate
    );
  }

}, [
  period,
  incomeStartDate,
  incomeEndDate
]);
  

  const handleStartDateChange = (e) => setStartDate(e.target.value);

  const handleAddExpense = async () => {
    const finalType = expenseType === "Other" ? customExpenseType : expenseType;
    if (!amount || !expenseType) {
  alert("Please fill all fields correctly!");
  return;
}
    const expenseData = { amount: Number(amount), expenseType: finalType, period, startDate, endDate,userId: userId  };
    console.log(
  "Saving Expense:",
  expenseData
);
    try {
      if (editIndex !== null) {
        const editId = expenses[editIndex].id;
        await axios.put(`${API_URL}/${editId}`, expenseData);
        setEditIndex(null);
      } else {
        const goalResponse =
await axios.get(
`http://localhost:8080/api/goals/user/${userId}/period`,
{
params: {
period,
startDate,
endDate
}
}
);

const goal =
goalResponse.data;

if (goal) {

const existingTotal =
expenses
.filter(exp =>
exp.period === period &&
exp.startDate === startDate &&
exp.endDate === endDate
)
.reduce(
(sum, exp) =>
sum + exp.amount,
0
);

const totalAfterAdd =
existingTotal +
Number(amount);

if (
totalAfterAdd >
goal.amount
) {

alert(
`⚠ Warning! Expense exceeded your goal of ₹${goal.amount}`
);

}
}
        await axios.post(API_URL, expenseData);
      }
      fetchExpenses();
      setAmount("");
      setExpenseType("");
      setCustomExpenseType("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };

  const handleEdit = (index) => {
    const expense = expenses[index];
    setAmount(expense.amount);
    setPeriod(
    expense.period
  );
    if (["Food", "Travel", "Rent", "Shopping"].includes(expense.expenseType)) {
      setExpenseType(expense.expenseType);
      setCustomExpenseType("");
    } else {
      setExpenseType("Other");
      setCustomExpenseType(expense.expenseType);
    }
    setStartDate(expense.startDate);
    setEndDate(expense.endDate);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${API_URL}/${expenses[index].id}`);
      fetchExpenses();
      if (editIndex === index) {
        setAmount("");
        setExpenseType("");
        setCustomExpenseType("");
        setStartDate("");
        setEndDate("");
        setEditIndex(null);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 4 }}>
      
      {/* Left Card: Expense Form */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", width: "35%" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2"  }}>
          Add Expense
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Enter Amount *" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth required />
          <TextField select label="Select Expense Type *" value={expenseType} onChange={(e) => setExpenseType(e.target.value)} fullWidth required>
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Rent">Rent</MenuItem>
            <MenuItem value="Shopping">Shopping</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          {expenseType === "Other" && <TextField label="Custom Expense Type *" value={customExpenseType} onChange={(e) => setCustomExpenseType(e.target.value)} fullWidth required />}
         <TextField
  select
  label="Period *"
  value={period}
  onChange={(e) =>
    setPeriod(e.target.value)
  }
  fullWidth
  SelectProps={{
    native: true
  }}
>

  <option value="">
  </option>

 <option value="Weekly">
    Weekly
  </option>

  <option value="Monthly">
    Monthly
  </option>

</TextField>
          <TextField type="date" label="Start Date *" InputLabelProps={{ shrink: true }} value={startDate}  fullWidth disabled required />
          <TextField type="date" label="End Date *" InputLabelProps={{ shrink: true }} value={endDate} fullWidth disabled required />
          <Button
  variant="contained"
  onClick={handleAddExpense}
  fullWidth
  sx={{
    backgroundColor: "#1976d2",   // blue
    color: "#fff",                // white text
    "&:hover": {
      backgroundColor: "#1565c0", // darker blue when hovering
    },
  }}
>
  {editIndex !== null ? "Update Expense" : "Add Expense"}
</Button>

          {success && <Alert severity="success">Expense saved successfully!</Alert>}
        </Box>
      </Paper>

      {/* Right Card: Expense Table */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: "16px", width: "60%", maxHeight: "70vh", overflowY: "auto" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Expense Entries
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
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.expenseType}</TableCell>
                  <TableCell>{expense.period}</TableCell>
                  <TableCell>{expense.startDate}</TableCell>
                  <TableCell>{expense.endDate}</TableCell>
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
