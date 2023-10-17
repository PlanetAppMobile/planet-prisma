import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require('express')
const router = express.Router();

const prisma = new PrismaClient()

// router.get('/users', async function (req: Request, res: Response, next: NextFunction){
//     const allUser = await prisma.user.findMany()
//     res.json({users:allUser})
// })
router.post('/login', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    // Find the user with the provided email
    const user = await prisma.user.findUnique({
      where: {
        user_email: email
      }
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    console.log(user.user_id)


    if (user.user_password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/user/:userId', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const userId: number = parseInt(req.params.userId);
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId
      }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ users: user })
  } catch (error) {
    next(error)
  } finally {
    await prisma.$disconnect();
  }
})
router.post('/user', async function (req: Request, res: Response, next: NextFunction) {
  try {
    const { fullName, email, password, phoneNumber } = req.body
    const user = await prisma.user.create({
      data: {
        user_fullname: fullName,
        user_email: email,
        user_password: password,
        user_phoneNumber: phoneNumber
      },
    }
    );
    res.status(201).json("Create User Successfully")
  } catch (error) {
    res.status(404).json("Error")
  } finally {
    await prisma.$disconnect();
  }
})
module.exports = router;