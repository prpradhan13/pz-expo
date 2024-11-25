import axios from "axios";
import { CreateExpenseProps, GetToken } from "./interface"

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

export const createExpense = async ({
  formData,
  getToken,
}: CreateExpenseProps) => {
  try {
    const token = await getToken();

    const res = await api.post(`/api/v1/expense`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getExpenseData = async (getToken: GetToken) => {
  try {
    const token = await getToken();

    const res = await api.get("/api/v1/expense", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(res.data);

    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log("expense Error:", error);
    return [];
  }
};

export const deleteExpenseData = async (
  expenseId: string,
  getToken: GetToken,
) => {
  try {
    const token = await getToken();
    const res = await api.delete(`/api/v1/expense/${expenseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
