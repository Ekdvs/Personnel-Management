import express from "express";
import { addProjectSkill, createProject, deleteProject, getAllProjects, getProjectById, removeProjectSkill, updateProject } from "../controllers/projectsController.js";


const projectsRouter = express.Router();
projectsRouter.post('/create',createProject);
projectsRouter.get('/getAll',getAllProjects);
projectsRouter.post('/addSkill/:id',addProjectSkill);
projectsRouter.get('/getById/:id', getProjectById);  // NEW
projectsRouter.put('/update/:id', updateProject);  // NEW
projectsRouter.delete('/delete/:id', deleteProject);
projectsRouter.delete('/removeSkill/:id/:skill_id', removeProjectSkill);

export default projectsRouter;