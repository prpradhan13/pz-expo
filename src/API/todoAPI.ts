import axios from "axios";
import { CreateTodoProps, GetToken, UpdateTaskChangeProps, UpdateTodoDataProps } from "./interface";

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true
});

export const createTodo = async ({formData, getToken}: CreateTodoProps) => {
    try {
        const token = await getToken();

        const res = await api.post(
            `/api/v1/todo/`, 
            formData,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getTodoData = async (getToken: GetToken) => {
    try {
        const token = await getToken();

        const res = await api.get(
            `/api/v1/todo`,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateTodoData = async ({todoId, tasks, getToken}: UpdateTodoDataProps) => {
    // console.log(todoId, tasks);
    
    try {
        const token = await getToken();

        const res = await api.put(
            `/api/v1/todo/${todoId}`, 
            { tasks: tasks },
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateTodoDetails = async ({todoId, userFillTitle, userDueDate, getToken}: any) => {
    try {
        const token = await getToken();

        const res = await api.put(
            `/api/v1/todo/${todoId}`, 
            {
                title: userFillTitle, 
                dueDate: userDueDate
            },
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );

        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const updateTaskChange = async ({isChecked, taskId, todoId, taskTitle, getToken}: UpdateTaskChangeProps) => {
    const payload = {  completed: isChecked, taskId, taskTitle};
    // console.log(payload);
    // console.log("todoId: ",todoId);

    try {
        const token = await getToken();

        const res = await api.patch(
            `/api/v1/todo/${todoId}`, 
            payload,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );

        return res.status === 200 ? res.data : []
    } catch (error: any) {
      console.error("Error updating task completion", error.response || error);
    }
};

export const removeTask = async (taskId: string, getToken: GetToken) => {
    try {
        const token = await getToken();

        const res = await api.delete(
            `/api/v1/todo/task/${taskId}`,
            {headers: {
                Authorization: `Bearer ${token}`
            }}
        );
        return res.status === 200 ? res.data : []
    } catch (error: any) {
        console.error("Error updating task completion", error.response || error);
    }
}