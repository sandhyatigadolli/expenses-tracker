import api from "./api";

// SUMMARY
export const getDashboardSummary = async (userId) => {
  const res = await api.get(`/dashboard/summary/${userId}`);
  return res.data;
};

// DAILY (weekly graph)
export const getDailyChart = async (userId, sinceDate) => {
  const res = await api.get(`/dashboard/daily/${userId}`, {
    params: { sinceDate },
  });
  return res.data;
};

// MONTHLY graph
export const getMonthlyChart = async (userId, startDate, endDate) => {
  const res = await api.get(`/dashboard/monthly/${userId}`, {
    params: { startDate, endDate },
  });
  return res.data;
};