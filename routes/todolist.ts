import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();

router.post(
    "/todolist/searchByDate",
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { todo_date, user_id } = req.body;
            console.log(todo_date);
            const todoItems = await prisma.todoList.findMany({
                where: {
                    todo_date: new Date(todo_date).toISOString(),
                    user_id: parseInt(user_id)
                },
            });
            res.status(200).json(todoItems);
        } catch (error) {
            console.error("Error searching for to-do items by date:", error);
            res
                .status(500)
                .json({ error: "Failed to search for to-do items by date" });
        }
    }
);

router.post(
    "/todolist",
    async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { todo_desc, todo_date, user_id } = req.body;
            const isoDate = new Date(todo_date).toISOString();
            const todo = await prisma.todoList.create({
                data: {
                    todo_desc,
                    todo_checked: false,
                    todo_date: isoDate,
                    user_id,
                },
            });

            res.status(201).json(todo); 
        } catch (error) {
            console.error("Error creating to-do item:", error);
            res.status(500).json({ error: "Failed to create to-do item" });
        }
    }
);

router.put("/todolist/:todo_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todo_id } = req.params;
        const { todo_checked } = req.body;

        const updatedTodo = await prisma.todoList.update({
            where: {
                todo_id: parseInt(todo_id),
            },
            data: {
                todo_checked,
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
router.delete("/todolist/:todo_id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { todo_id } = req.params;

        const deletedTodo = await prisma.todoList.delete({
            where: {
                todo_id: parseInt(todo_id),
            },
        });

        if (deletedTodo) {
            res.status(204).end(); 
        } else {
            res.status(404).json({ error: "To-do item not found" });
        }
    } catch (error) {
        console.error("Error deleting to-do item:", error);
        res.status(500).json({ error: "Failed to delete to-do item" });
    }
});


module.exports = router;
