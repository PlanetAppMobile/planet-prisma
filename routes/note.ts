import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require('express')
const router = express.Router();

const prisma = new PrismaClient()

// router.get('/users', async function (req: Request, res: Response, next: NextFunction){
//     const allUser = await prisma.user.findMany()
//     res.json({users:allUser})
// })

router.get('/note/:userId/:noteId', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const noteId: number = parseInt(req.params.noteId);
        const userId: number = parseInt(req.params.userId);
        const note = await prisma.note.findUnique({
            where: {
                user_id: userId,
                note_id: noteId
            }
        })
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note)
    } catch (error) {
        next(error)
    } finally {
        await prisma.$disconnect();
    }
})
router.get('/note/:userId', async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userId: number = parseInt(req.params.userId);
        const note = await prisma.note.findMany({
            where: {
                user_id: userId
            }
        })
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(note)
    } catch (error) {
        next(error)
    } finally {
        await prisma.$disconnect();
    }
})
router.post('/note', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { topic, description, created_at, updated_at, user_id } = req.body;
        const createDate = new Date(created_at).toISOString();
        const updateDate = new Date(updated_at).toISOString();
        const note = await prisma.note.create({
            data: {
                topic,
                description,
                created_at : createDate,
                updated_at : updateDate,
                user_id 
            },
        });

        res.status(201).json(note); 
    } catch (error) {
        next(error); 
    }
});
router.put("/note/:userId/:noteId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const noteId: number = parseInt(req.params.noteId);
        const userId: number = parseInt(req.params.userId);
        const { topic, description, created_at, updated_at, user_id } = req.body;
        const createDate = new Date(created_at).toISOString();
        const updateDate = new Date(updated_at).toISOString();
        const updatedNote = await prisma.note.update({
            where: {
                note_id: noteId,
                user_id: userId
            },
            data: {
                topic,
                description,
                created_at : createDate,
                updated_at : updateDate,
                user_id 
            },
        });

        if (updatedNote) {
            res.status(200).json(updatedNote);
        } else {
            res.status(404).json({ error: "Note item not found" });
        }
    } catch (error) {
        console.error("Error updating Note item:", error);
        res.status(500).json({ error: "Failed to update Note item" });
    }
});
router.delete("/note/:noteId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { noteId } = req.params;

        const deletedNote = await prisma.note.delete({
            where: {
                note_id: parseInt(noteId),
            },
        });

        if (deletedNote) {
            res.status(204).end(); 
        } else {
            res.status(404).json({ error: "Note item not found" });
        }
    } catch (error) {
        console.error("Error deleting note item:", error);
        res.status(500).json({ error: "Failed to delete note item" });
    }
});

module.exports = router;