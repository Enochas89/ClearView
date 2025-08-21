import api from "./axios"

export const listProjects = () => api.get("/api/projects")
export const createProject = (data) => api.post("/api/projects", data)
export const projectIdExists = (projectId) =>
  api.get("/api/projects/exists", { params: { projectId } })
