import api from './api';

export const taskService = {
  getTasks: async () => {
    try {
      const response = await api.get('/api/tasks/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createTask: async (taskData) => {
    try {
      const requestData = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null
      };
      
      const response = await api.post('/api/tasks/create/', requestData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      const response = await api.patch(`/api/tasks/${taskId}/status/`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await api.put(`/api/tasks/${taskId}/`, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await api.delete(`/api/tasks/${taskId}/`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
