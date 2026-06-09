import React, { useEffect, useState, useContext } from "react";
import {
  Paper,
  Box,
  Button,
  Typography
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import {
  getDashboardSummary,
  getDailyChart,
  getMonthlyChart,
} from "../services/dashboardService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
Bar,
} from "recharts";

/* ─── Fonts ─────────────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap";
document.head.appendChild(fontLink);

/* ─── Design tokens ──────────────────────────────────────────────── */
const tokens = {
  bg: "#F6F5F2",
  surface: "#FFFFFF",
  border: "#E8E6E1",
  borderStrong: "#D1CEC7",
  textPrimary: "#1A1917",
  textSecondary: "#6B6760",
  textMuted: "#9C9990",
  accent: "#1D9E75",        // teal – savings / positive
  accentAlt: "#7F77DD",     // purple – monthly
  danger: "#D85A30",        // coral – overspend
  warn: "#BA7517",          // amber – near-limit
  blue: "#378ADD",
  radius: "14px",
  radiusSm: "8px",
  shadow: "0 1px 4px rgba(0,0,0,0.06)",
};

/* ─── Helpers ─────────────────────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const customTooltip =
  (color = tokens.accent) =>
  ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: tokens.radiusSm,
          padding: "8px 14px",
          fontSize: 13,
          fontFamily: "'DM Sans', sans-serif",
          color: tokens.textPrimary,
          boxShadow: tokens.shadow,
        }}
      >
        <div style={{ color: tokens.textMuted, marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 600, color }}>
          {fmt(payload[0]?.value)}
        </div>
      </div>
    );
  };

/* ─── KPI card ───────────────────────────────────────────────────── */
function KpiCard({
  icon,
  title,
  value,
  sub,
  accent = "#16a34a"
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "22px",
        background: "#fff",
        border: "1px solid #eef2f7",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)"
        }
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
      >
        {/* Icon Box */}
        <Box
          sx={{
            width: 58,
            height: 58,
            borderRadius: "18px",
            background: `${accent}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px"
          }}
        >
          {icon}
        </Box>

        {/* Text */}
        <Box>
          <Typography
            sx={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#6b7280",
              textTransform: "uppercase"
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2rem",
              color: "#111827"
            }}
          >
            ₹{value ?? 0}
          </Typography>

          {sub && (
            <Typography
              sx={{
                mt: 0.5,
                color: accent,
                fontSize: "13px",
                fontWeight: 600
              }}
            >
              {sub}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

/* ─── Section card wrapper ───────────────────────────────────────── */
const Card = ({ title, children, style = {} }) => (
  <div
    style={{
      background: tokens.surface,
      border: `1px solid ${tokens.border}`,
      borderRadius: tokens.radius,
      padding: "22px 24px",
      boxShadow: tokens.shadow,
      ...style,
    }}
  >
    {title && (
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: tokens.textPrimary,
          marginBottom: 18,
          fontFamily: "'Sora', sans-serif",
        }}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

/* ─── Period tab buttons ─────────────────────────────────────────── */
const PeriodTabs = ({ active, onChange }) => {
  const tabs = ["Weekly", "Monthly", "Yearly"];
  return (
    <div
      style={{
        display: "flex",
        background: tokens.bg,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radiusSm,
        padding: 3,
        gap: 2,
      }}
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            padding: "5px 14px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.15s",
            background: active === t ? tokens.surface : "transparent",
            color: active === t ? tokens.textPrimary : tokens.textMuted,
            boxShadow: active === t ? tokens.shadow : "none",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

/* ─── Stat row (for spending breakdown) ──────────────────────────── */
const StatRow = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${tokens.border}`,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, color: tokens.textPrimary, flex: 1 }}>
        {label}
      </span>
      <div
        style={{
          flex: 2,
          height: 5,
          background: tokens.bg,
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: tokens.textPrimary,
          minWidth: 80,
          textAlign: "right",
        }}
      >
        {fmt(value)}
      </span>
      <span
        style={{
          fontSize: 11,
          color: tokens.textMuted,
          minWidth: 32,
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
};

/* ─── Main Dashboard ──────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?.userId;

  const [summary, setSummary] = useState({});
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [period, setPeriod] = useState("Weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      const today = new Date();

      const s = await getDashboardSummary(userId);
      setSummary(s);
      console.log("Dashboard Summary", s);

      const last7 = new Date();
      last7.setDate(today.getDate() - 6);
      const w = await getDailyChart(userId, last7.toISOString().split("T")[0]);
      setWeekly((w || []).map(([date, total]) => ({ date, total })));

      // ===== Monthly Chart =====
const monthStart =
  new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

const m =
  await getDailyChart(
    userId,
    monthStart
      .toISOString()
      .split("T")[0]
  );

setMonthly(
  (m || []).map(
    ([date, total]) => ({
      date,
      total,
    })
  )
);

      const yearStart =
  new Date(
    today.getFullYear(),
    0,
    1
  );

const y =
  await getMonthlyChart(
    userId,
    yearStart
      .toISOString()
      .split("T")[0],
    today
      .toISOString()
      .split("T")[0]
  );

setYearly(
  (y || []).map(
    ([month, total]) => ({
      month,
      total,
    })
  )
);

      setLoading(false);
    };
    load();
  }, [userId]);

  if (!userId)
    return (
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          padding: 40,
          color: tokens.textMuted,
          textAlign: "center",
        }}
      >
        Loading user…
      </div>
    );

  /* derived */
  const chartData =
  period === "Weekly"
    ? weekly
    : period === "Monthly"
    ? monthly
    : yearly;

const chartKey =
  period === "Weekly"
    ? "date"
    : period === "Monthly"
    ? "month"
    : "year";

const chartColor =
  period === "Weekly"
    ? tokens.accent
    : period === "Monthly"
    ? tokens.accentAlt
    : tokens.warn;

  const spendBreakdown = [
    { label: "Today", value: summary.today || 0, color: tokens.blue },
    { label: "Last 7 days", value: summary.last7Days || 0, color: tokens.accentAlt },
    { label: "Last 30 days", value: summary.last30Days || 0, color: tokens.accent },
    { label: "This year", value: summary.currentYear || 0, color: tokens.warn },
  ];
  const breakdownTotal = summary.currentYear || 1;

  /* alert: if today > 80% of last30/30 daily avg */
  const dailyAverage =
  (summary.last30Days || 0) / 30;

const budgetUsedPercent =
  summary.goalAmount
    ? (
        (summary.totalExpenses || 0) /
        summary.goalAmount
      ) * 100
    : 0;

let alertMessage = "";
let alertBg = "";
let alertBorder = "";
let alertColor = "";

/* No Goal */
if (!summary.goalAmount) {
  alertMessage =
    "🎯 No budget goal found. Set a weekly or monthly goal to track spending better.";

  alertBg = "#EEF2FF";
  alertBorder = "#C7D2FE";
  alertColor = "#4F46E5";
}

/* Over Budget */
else if (summary.overGoal) {
  alertMessage =
    `⚠ You exceeded your ${summary.periodType || ""}
    budget by ₹${Math.abs(summary.remainingAmount || 0)}.
    Consider reducing unnecessary spending.`;

  alertBg = "#FEF2F2";
  alertBorder = "#FECACA";
  alertColor = "#DC2626";
}

/* Near Budget */
else if (
  budgetUsedPercent >= 80
) {
  alertMessage =
    `⚡ You have used ${Math.round(
      budgetUsedPercent
    )}% of your ${
      summary.periodType || ""
    } budget. Spend carefully for remaining days.`;

  alertBg = "#FFF7ED";
  alertBorder = "#FED7AA";
  alertColor = "#EA580C";
}

/* High Spending Today */
else if (
  summary.today >
  dailyAverage * 2
) {
  alertMessage =
    "📈 Today's spending is much higher than your average. Review unnecessary expenses.";

  alertBg = "#FEF3C7";
  alertBorder = "#FCD34D";
  alertColor = "#D97706";
}

/* Good Spending */
else {
  alertMessage =
    `✅ Great! You're managing expenses well. ₹${
      summary.remainingAmount || 0
    } budget remaining.`;

  alertBg = "#ECFDF5";
  alertBorder = "#A7F3D0";
  alertColor = "#16A34A";
}

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: tokens.bg,
        minHeight: "100vh",
        padding: "28px 28px 48px",
        boxSizing: "border-box",
      }}
    >
     {/* ── Premium Header ── */}
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 16,
  }}
>
  {/* Left Side */}
  <div>
    <h1
      style={{
        margin: 0,
        fontSize: 34,
        fontFamily: "'Sora', sans-serif",
        fontWeight: 700,
        color: tokens.textPrimary,
      }}
    >
      Budget Dashboard
    </h1>

    <p
      style={{
        marginTop: 8,
        fontSize: 15,
        color: tokens.textSecondary,
      }}
    >
      Track your spending, stay on budget and achieve your goals.
    </p>
  </div>

  {/* Right Side */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    {/* Date pill */}
    <div
      style={{
        background: tokens.surface,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: "12px 18px",
        boxShadow: tokens.shadow,
        fontSize: 14,
        color: tokens.textPrimary,
        fontWeight: 500,
      }}
    >
      📅{" "}
      {new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </div>

    {/* Period tabs */}
    <PeriodTabs
      active={period}
      onChange={setPeriod}
    />
  </div>
</div>

      {/* ── Alert bar ── */}
     <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: alertBg,
    border: `1px solid ${alertBorder}`,
    borderRadius: tokens.radiusSm,
    padding: "12px 18px",
    marginBottom: 20,
    fontSize: 14,
    color: alertColor,
    fontWeight: 600,
  }}
>
  {alertMessage}
</div>

      {/* ── KPI grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <KpiCard icon="💸" title="Today's Spent" value={summary.today} />
        <KpiCard
          icon="📅"
          title="Weekly Spent"
          value={summary.last7Days}
          sub="Last 7 days"
          accent={tokens.accentAlt}
        />
        <KpiCard
          icon="🗓️"
          title="Monthly Spent"
          value={summary.last30Days}
          sub="Last 30 days"
          accent={tokens.blue}
        />
        <KpiCard
          icon="📊"
          title="Yearly Spent"
          value={summary.currentYear}
          sub="Current year"
          accent={tokens.accent}
        />
      </div>

      {/* ── Charts row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Spending trend */}
        <Card title={
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    sx={{ width: "100%" }}
  >
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "24px",
          color: "#111827"
        }}
      >
        Spending Trend
      </Typography>

      <Typography
        sx={{
          color: "#6b7280",
          fontSize: "14px"
        }}
      >
        View spending pattern
      </Typography>
    </Box>

   <div />
  </Box>
}>
          {loading ? (
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: tokens.textMuted, fontSize: 13 }}>
              Loading chart…
            </div>
          ) : (
            <ResponsiveContainer
  width="100%"
  height={330}
>
  {period === "Monthly" ? (

   <AreaChart data={chartData}>
  <defs>
    <linearGradient
      id="grad"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop
        offset="5%"
        stopColor={chartColor}
        stopOpacity={0.3}
      />
      <stop
        offset="95%"
        stopColor={chartColor}
        stopOpacity={0}
      />
    </linearGradient>
  </defs>

  <CartesianGrid
    strokeDasharray="3 3"
    vertical={false}
  />

  <XAxis
    dataKey="date"
    tickFormatter={(value) => {
      if (!value) return "";

      const parts =
        value.split("-");

      return `${parts[2]} ${
        new Date(
          parts[0],
          parts[1] - 1
        ).toLocaleString(
          "en-IN",
          {
            month: "short"
          }
        )
      }`;
    }}
  />

  <YAxis />

  <Tooltip
    formatter={(value) => [`₹${value}`]}
  />

  <Area
    type="monotone"
    dataKey="total"
    stroke={chartColor}
    fill="url(#grad)"
    strokeWidth={3}
  />
</AreaChart>

  ) : (

    <BarChart
      data={chartData}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
      />

      <XAxis
  dataKey={chartKey}
  axisLine={false}
  tickLine={false}
  tick={{
    fontSize: 13,
    fill: tokens.textPrimary,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif"
  }}
  tickFormatter={(value) => {

    // Weekly → Fri, Mon, Thu
    if (period.toLowerCase() === "weekly") {
      return new Date(value).toLocaleDateString(
        "en-IN",
        { weekday: "short" }
      );
    }

    // Monthly → 1 May, 18 May
    if (period.toLowerCase() === "monthly") {
      const date = new Date(value);

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );
    }

    // Yearly → Jan, Feb, Mar
    if (period.toLowerCase() === "yearly") {
      const date = new Date(value);

      return date.toLocaleDateString(
        "en-IN",
        {
          month: "short",
        }
      );
    }

    return value;
  }}
/>
      <YAxis />

      <Tooltip />

      <Bar
  dataKey="total"
  fill={chartColor}
  radius={[10,10,0,0]}
  maxBarSize={70}
/>
    </BarChart>

  )}
</ResponsiveContainer>
          )}
        </Card>

        {/* All-time total + breakdown */}
       <Card
  title={
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "28px",
        }}
      >
        Spending Breakdown
      </Typography>

      <Typography
        sx={{
          color: "#6b7280",
          mt: 0.5,
          fontSize: "14px",
        }}
      >
        Spending overview
      </Typography>
    </Box>
  }
>
          <div
            style={{
              fontSize: 32,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700,
              color: tokens.textPrimary,
              marginBottom: 4,
            }}
          >
            {fmt(summary.total)}
          </div>
          <div style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 16 }}>
            All-time total
          </div>
          {spendBreakdown.map((row) => (
            <StatRow key={row.label} {...row} total={breakdownTotal} />
          ))}
        </Card>
      </div>



{/* ── Budget Progress ── */}
<Card
  title={
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "28px",
        }}
      >
        Budget Progress
      </Typography>

      <Typography
        sx={{
          color: "#6b7280",
          mt: 0.5,
          fontSize: "14px",
        }}
      >
        Goal tracking overview
      </Typography>
    </Box>
  }
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 18,
    }}
  >
    <div>
      <div
        style={{
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        Goal Amount
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#111827",
        }}
      >
        ₹{summary.goalAmount || 0}
      </div>
    </div>

    <div style={{ textAlign: "right" }}>
      <div
        style={{
          color: "#6b7280",
          fontSize: 13,
        }}
      >
        Spent
      </div>

      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color:
            summary.overGoal
              ? "#dc2626"
              : "#16a34a",
        }}
      >
        ₹{summary.totalExpenses || 0}
      </div>
    </div>
  </div>

  {/* Progress Bar */}
  <div
    style={{
      height: 14,
      background: "#edf2f7",
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 14,
    }}
  >
    <div
      style={{
        width: `${
          summary.goalAmount
            ? Math.min(
                (summary.totalExpenses /
                  summary.goalAmount) *
                  100,
                100
              )
            : 0
        }%`,
        height: "100%",
        background:
          summary.overGoal
            ? "#ef4444"
            : "#22c55e",
        transition: "0.4s ease",
      }}
    />
  </div>

  <Typography
    sx={{
      fontWeight: 600,
      color:
        summary.overGoal
          ? "#dc2626"
          : "#16a34a",
    }}
  >
    {summary.overGoal
      ? `⚠ Over budget by ₹${
          summary.totalExpenses -
          summary.goalAmount
        }`
      : `₹${
          summary.goalAmount -
          summary.totalExpenses
        } remaining`}
  </Typography>
</Card>


      {/* ── Insight footer ── */}
      {/* ── Quick Insights ── */}
<Card
  title={
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "28px",
        }}
      >
        Quick Insights
      </Typography>

      <Typography
        sx={{
          color: "#6b7280",
          mt: 0.5,
          fontSize: "14px",
        }}
      >
        Smart spending summary
      </Typography>
    </Box>
  }
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(240px, 1fr))",
      gap: 16,
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "#eefbf3",
        border: "1px solid #d1fae5",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Daily Average
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "#16a34a",
        }}
      >
       ₹{Math.round((summary.last30Days || 0) / 30)}
      </Typography>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "#fff7ed",
        border: "1px solid #fed7aa",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Yesterday Spent
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "#ea580c",
        }}
      >
        ₹{summary.yesterday || 0}
      </Typography>
    </Paper>

    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#6b7280",
        }}
      >
        Total Spending
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "#2563eb",
        }}
      >
        ₹{summary.total || 0}
      </Typography>
    </Paper>
  </div>
</Card>
      </div>
  );
}