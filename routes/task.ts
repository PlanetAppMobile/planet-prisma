import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();
router.get("/task/:projectId", async function (req: Request, res: Response, next: NextFunction) {
    const projectId = parseInt(req.params.projectId);
    
    try {
        const projects = await prisma.task.findMany({
            where: {
                project_id: projectId,
            },
        });

        res.json(projects);
    } catch (error) {
        res.json(error);
    }
});

router.get("/task/:projectId/searchByType", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const projectId = parseInt(req.params.projectId);
        const task_status = req.body.task_status;

        const tasks = await prisma.task.findMany({
            where: {
                project_id: projectId,
                task_status
            },
        });

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error searching for tasks by type:", error);
        res.status(500).json({ error: "Failed to search for tasks by type" });
    }
});

router.post("/task", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { task_name, task_status, project_id } = req.body;

        const task = await prisma.task.create({
            data: {
                task_name,
                task_status,
                project_id
            }
        });

        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});
router.put("/task/:taskId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId: number = parseInt(req.params.taskId);
        const { task_status } = req.body;
        let status: string
        if (task_status == 'todo'){
            status = "inprogress"
        }else if (task_status == "inprogress"){
            status = "done"
        }else if (task_status == "done"){
            status = "inprogress"
        }
        const updatedTodo = await prisma.task.update({
            where: {
                task_id: taskId,
            },
            data: {
                task_status: status,
            },
        });

        if (updatedTodo) {
            res.status(200).json(updatedTodo);
        } else {
            res.status(404).json({ error: "To-do item not found" });
        }
    } catch (error) {
        console.error("Error updating to-do item:", error);
        res.status(500).json({ error: "Failed to update to-do item" });
    }
});

module.exports = router;