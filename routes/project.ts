import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();
router.get("/project/:userId", async function (req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);
    
    try {
        const projects = await prisma.project.findMany({
            where: {
                assigned_to: userId,
            },
        });

        res.json(projects);
    } catch (error) {
        res.json(error);
    }
});


router.post("/project", async function (req: Request, res: Response, next: NextFunction) {
    const { name, description, deadline, start_date, end_date, status, assigned_to } = req.body;
    
    try {
        const project = await prisma.project.create({
            data: {
                project_name: name,
                project_description: description,
                project_deadline: new Date(deadline),
                project_start_date: new Date(start_date),
                project_end_date: new Date(end_date),
                project_status: status,
                assigned_to: assigned_to,
            },
        });

        res.json(project);
    } catch (error) {
        res.json(error);
    }
});
router.delete("/project/:projectId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;

        await prisma.task.deleteMany({
            where: {
                project_id: parseInt(projectId),
            },
        });
        const deletedProject = await prisma.project.delete({
            where: {
                project_id: parseInt(projectId),
            },
        });

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;