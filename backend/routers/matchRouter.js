import express from "express";
import { getPartialMatches, matchPersonnelToProject } from "../controllers/matchController.js";

const matchRouter = express.Router();
matchRouter.get('/:id', matchPersonnelToProject);
matchRouter.get('/partial/:id', getPartialMatches); 
export default matchRouter;