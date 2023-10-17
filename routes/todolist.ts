import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();

const prisma = new PrismaClient();


router.post("/todolist/searchByDate", async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { todo_date, user_id } = req.body; // Use req.query to get query parameters
        console.log(todo_date);
        const todoItems = await prisma.todoList.findMany({
            where: {
                todo_date: new Date(todo_date).toISOString(),
                user_id: parseInt(user_id), // Ensure user_id is parsed as an integer
            },
        });
        res.status(200).json(todoItems);
    } catch (error) {
        console.error("Error searching for to-do items by date:", error);
        res.status(500).json({ error: "Failed to search for to-do items by date" });
    }
});


router.post("/todolist",async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { todo_desc, todo_date, user_id } = req.body;
            // Create the to-do item
            const isoDate = new Date(todo_date).toISOString();
            const todo = await prisma.todoList.create({
                data: {
                    todo_desc,
                    todo_checked: false,
                    todo_date: isoDate,
                    user_id,
                },
            });

            res.status(201).json(todo); // Respond with the created to-do item
        } catch (error) {
            console.error("Error creating to-do item:", error);
            res.status(500).json({ error: "Failed to create to-do item" });
        }
    }
);
module.exports = router;
