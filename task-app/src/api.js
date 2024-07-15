import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
