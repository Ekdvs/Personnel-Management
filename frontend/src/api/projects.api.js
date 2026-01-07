import api from "./axios";

// Project CRUD
export const createProject = (data) => api.post("/projects/create", data);
export const getAllProjects = () => api.get("/projects/getAll");
export const getProjectById = (id) => api.get(`/projects/getById/${id}`);
export const updateProject = (id, data) => api.put(`/projects/update/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/delete/${id}`);

// Project Skills
export const addProjectSkill = (id, data) => api.post(`/projects/addSkill/${id}`, data);
export const removeProjectSkill = (projectId, skillId) => api.delete(`/projects/removeSkill/${projectId}/${skillId}`);

// Project → Personnel Matching
export const matchPersonnel = (projectId) => api.get(`/match/${projectId}`);
export const getPartialMatches = (projectId, minMatch = 50) =>
  api.get(`/match/partial/${projectId}?min_match=${minMatch}`);
