import express from 'express';
import { assignSkillToPersonnel, createPersonnel, deletePersonnelById, getAllPersonnel, getPersonnelById, searchPersonnel, updatePersonnelById } from '../controllers/personnelController.js';

const personnelRouter = express.Router();

personnelRouter.post('/create',createPersonnel);
personnelRouter.get('/getAll',getAllPersonnel);
personnelRouter.get('/getById/:id',getPersonnelById);
personnelRouter.put('/update/:id',updatePersonnelById);
personnelRouter.delete('/delete/:id',deletePersonnelById);
personnelRouter.post('/assignSkill/:id',assignSkillToPersonnel);
personnelRouter.post('/search', searchPersonnel);

export default personnelRouter