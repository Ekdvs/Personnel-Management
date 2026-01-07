import api from "./axios";

export const matchPersonnel = (projectId) => api.get(`/match/${projectId}`);
export const getPartialMatches = (projectId, minMatch = 50) => 
  api.get(`/match/partial/${projectId}?min_match=${minMatch}`);