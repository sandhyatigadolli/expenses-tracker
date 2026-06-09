import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
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




export default function SetGoal() {
  const { user } = useContext(AuthContext);
const userId = user?.id || user?.userId;
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [incomeStartDate,setIncomeStartDate]= useState("");
  const [incomeEndDate,setIncomeEndDate]= useState("");
  const API_BASE_URL = "http://localhost:8080/api/goals"; 
  const INCOME_API = "http://localhost:8080/api/incomes";

  const fetchLatestIncome = async () => {

  if (!userId) return;

  try {

    const response =
      await axios.get(
        `${INCOME_API}/user/${userId}`
      );

    const incomes =
      response.data;

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

  } catch (error) {

    console.error(
      "Error fetching income:",
      error
    );
  }
};


  const [goals, setGoals] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [msg, setMsg] = useState("");


 const fetchExpenseTotal =
async () => {

  if (
    !userId ||
    !startDate ||
    !endDate
  ) return;

  try {

    const response =
      await axios.get(
`http://localhost:8080/api/expenses/user/${userId}/total`,
{
  params: {
    startDate,
    endDate
  }
}
      );

    setPeriodExpenseTotal(
      response.data || 0
    );

  } catch (error) {
    console.error(
      "Error fetching expense total:",
      error
    );
  }
};


useEffect(() => {

  if (
    userId &&
    startDate &&
    endDate
  ) {
    fetchExpenseTotal();
  }

}, [
  userId,
  startDate,
  endDate,
  period
]);

  useEffect(() => {
    const saved = localStorage.getItem("incomePeriod") || "";
    setPeriod(saved);

    const onStorage = (e) => {
      if (e.key === "incomePeriod") setPeriod(e.newValue || "");
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);


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

const fetchGoals = async () => {
  if (!userId) return;

  try {
    const response = await axios.get(
      `${API_BASE_URL}/user/${userId}`
    );
    setGoals(response.data);
  } catch (error) {
    console.error("Error fetching goals:", error);
  }
};

useEffect(() => {

  if (userId) {

    fetchGoals();

    fetchLatestIncome();
  }

}, [userId]);


  const [periodExpenseTotal,
setPeriodExpenseTotal]
= useState(0);

  const validate = () => {
    if (!period) {
      setMsg("Please set Income period first (Weekly/Monthly).");
      return false;
    }
    if (!amount || Number(amount) <= 0 || !startDate || !endDate) {
      setMsg("All fields are required.");
      return false;
    }
    if (
  Number(amount) <= periodExpenseTotal
) {

  setMsg(
   `Goal must be greater than total expenses (₹${periodExpenseTotal}).`
  );

  return false;
}
    setMsg("");
    return true;
  };

const handleSubmit = async () => {
  if (!validate()) return; 

  const newGoal = {
  amount,
  period,
  startDate,
  endDate,
  userId: userId   
};

  try {
  if (editIndex !== null) {

  await axios.put(
    `${API_BASE_URL}/${editIndex}`,
    newGoal
  );

} else {

  await axios.post(
    API_BASE_URL,
    newGoal
  );
}

    fetchGoals(); 
setAmount("");
setEditIndex(null);
  } catch (error) {
    console.error("Error saving goal:", error);
  }
};


 const handleEdit = (goal) => {
  setAmount(goal.amount);
  setPeriod(goal.period);
  setStartDate(goal.startDate);
  setEndDate(goal.endDate);

  setEditIndex(goal.id);
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
    fetchGoals();
  } catch (error) {
    console.error("Error deleting goal:", error);
  }
};


  return (
    <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center", mt: 5, gap: 4 }}>
      
    
      <Paper elevation={3} sx={{ p: 3, borderRadius: "16px", width: "35%" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          {editIndex !== null ? "Edit Goal" : "Add Goal"}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Goal Amount *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            required
            error={!!msg && Number(amount || 0) <= periodExpenseTotal}
            helperText={!!msg && Number(amount || 0) <= periodExpenseTotal ? msg : ""}
          />
          <TextField
  select
  label="Period *"
  value={period || ""}
  onChange={(e) =>
    setPeriod(e.target.value)
  }
  fullWidth
  required
  SelectProps={{
    native: true
  }}
>
  
  <option value="Weekly">
    Weekly
  </option>

  <option value="Monthly">
    Monthly
  </option>

</TextField>
          <TextField type="date" label="Start Date *" InputLabelProps={{ shrink: true }} value={startDate} fullWidth disabled required />
          <TextField type="date" label="End Date *" InputLabelProps={{ shrink: true }} value={endDate} fullWidth disabled required />
          {msg && !(Number(amount || 0) >= periodExpenseTotal) && <Alert severity="error">{msg}</Alert>}
          <Alert severity="info">Total expenses in this period & range: ₹{periodExpenseTotal}</Alert>
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            {editIndex !== null ? "Update Goal" : "Add Goal"}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, borderRadius: "16px", width: "60%", maxHeight: "70vh", overflowY: "auto" }}>
        <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Goal Entries
        </Typography>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>Amount</b></TableCell>
                <TableCell><b>Period</b></TableCell>
                <TableCell><b>Start</b></TableCell>
                <TableCell><b>End</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goals.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>₹{g.amount}</TableCell>
                  <TableCell>{g.period}</TableCell>
                  <TableCell>{g.startDate}</TableCell>
                  <TableCell>{g.endDate}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" size="small" onClick={() => handleEdit(g)}><Edit /></IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(g.id)}><Delete /></IconButton>
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
