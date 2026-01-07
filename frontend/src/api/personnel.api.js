import api from "./axios";

export const createPersonnel = (data) =>
  api.post("/personnel/create", data);

export const getAllPersonnel = () =>
  api.get("/personnel/getAll");

export const getPersonnelById = (id) =>
  api.get(`/personnel/getById/${id}`);

export const updatePersonnel = (id, data) =>
  api.put(`/personnel/update/${id}`, data);

export const deletePersonnel = (id) =>
  api.delete(`/personnel/delete/${id}`);

export const assignSkillToPersonnel = (id, data) =>
  api.post(`/personnel/assignSkill/${id}`, data);

export const searchPersonnel = (query) =>
  api.post("/personnel/search", { 
    skill_name: query,
    role: query 
  });