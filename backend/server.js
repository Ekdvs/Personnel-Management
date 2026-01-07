import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import personnelRouter from './routers/personnelRouter.js';
import skillRouter from './routers/skillRouter.js';
import projectsRouter from './routers/projectsRouter.js';
import matchRouter from './routers/matchRouter.js';



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/personnel", personnelRouter);
app.use("/api/skills", skillRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/match", matchRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
