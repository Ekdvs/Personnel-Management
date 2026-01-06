import express from 'express';
import { createSkill, deleteSkillById, getAllSkills, updateSkillById } from '../controllers/skillsController.js';

const skillRouter = express.Router();
skillRouter.post('/create',createSkill)
skillRouter.get('/getAll',getAllSkills);
skillRouter.put('/update/:id',updateSkillById);
skillRouter.delete('/delete/:id',deleteSkillById);

export default skillRouter