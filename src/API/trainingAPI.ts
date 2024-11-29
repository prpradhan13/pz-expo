import axios from "axios";
import { CreateTrainingProps, GetToken } from "./interface";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

export const createTraining = async ({
  trainingFormData,
  getToken,
}: CreateTrainingProps) => {
  try {
    const token = await getToken();

    const res = await api.post("/api/v1/training", trainingFormData, {
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

export const getTraining = async (getToken: GetToken) => {
  try {
    const token = await getToken();
    const res = await api.get(`/api/v1/training`, {
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

export const deleteTrainingData = async (
  trainingId: string,
  getToken: GetToken
) => {
  try {
    const token = await getToken();

    const res = await api.delete(`/api/v1/training/${trainingId}`, {
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

export const getPublicTrainingData = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc"
) => {
  try {
    const res = await api.get(`/api/v1/training/public`, {
      params: { page, limit, sortBy, order },
    });

    return res.status === 200 ? res.data : { trainingData: [], total: 0 };
  } catch (error) {
    console.error("Error fetching public training data:", error);
    return { trainingData: [], total: 0 };
  }
};

export const togglePublic = async ({getToken, trainingId, isPublic}: any) => {
  try {
    const token = await getToken();

    const res = await api.patch(
      `/api/v1/training/${trainingId}`,
      {isPublic},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.error("Error toggling public:", error);
    return null;
  }
}

export const addNewDataOnExistingTraining = async ({ getToken, trainingId, trainingPlan }: any) => {
  try {
    const token = await getToken();
    console.log(getToken, trainingId, trainingPlan);
    
    const res = await api.put(
      `/api/v1/training/${trainingId}`,
      {trainingPlan},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return res.status === 200 ? res.data : [];

  } catch (error) {
    console.log(error);
    return null;
  }
}
