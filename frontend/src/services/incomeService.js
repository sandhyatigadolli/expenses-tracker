import axios from 'axios';

const API_URL = 'http://localhost:8080/api/income';

export const getIncomes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addIncome = async (incomeData) => {
  const response = await axios.post(API_URL, incomeData);
  return response.data;
};

export const updateIncome = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};

export const deleteIncome = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
