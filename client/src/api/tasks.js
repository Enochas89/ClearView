import api from "./axios";

export const listTasks = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/api/tasks${query ? `?${query}` : ""}`);
};

export const createTask = (data) => api.post("/api/tasks", data);
export const moveTask = (id, deltaDays) =>
  api.patch(`/api/tasks/${id}/move`, { deltaDays });
export const resizeTask = (id, data) =>
  api.patch(`/api/tasks/${id}/resize`, data);
export const updateProgress = (id, progress) =>
  api.patch(`/api/tasks/${id}/progress`, { progress });
export const updateTask = (id, data) => api.patch(`/api/tasks/${id}`, data);
