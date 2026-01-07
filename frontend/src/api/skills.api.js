import api from "./axios";

export const createSkill = (data) =>
  api.post("/skills/create", data);

export const getAllSkills = () =>
  api.get("/skills/getAll");

export const updateSkill = (id, data) =>
  api.put(`/skills/update/${id}`, data);

export const deleteSkill = (id) =>
  api.delete(`/skills/delete/${id}`);