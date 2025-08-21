import api from "./axios"

export const listPosts = (projectId, day) =>
  api.get(`/api/posts`, { params: { projectId, day } })

export const createPost = (data) =>
  api.post("/api/posts", data) // { project, day, type, content }

export const likePost = (id) =>
  api.post(`/api/posts/${id}/like`)

export const addComment = (id, text) =>
  api.post(`/api/posts/${id}/comments`, { text })
