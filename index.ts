import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express();

app.use(cors())

app.use(express.static('static'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'static')))

const prisma = new PrismaClient()
// const users = require('./routes/users')
// const project = require('./routes/project')
// app.use(users)
// app.use(project)
app.get('/users', async function (req: Request, res: Response, next: NextFunction){
    const allUser = await prisma.user.findMany()
    res.json({users:allUser})
})
app.get('/user', async function (req: Request, res: Response, next: NextFunction){
    const { userId } = req.body
    const allUser = await prisma.user.findUnique({
        where:{
            user_id: userId
        }
    })
    res.json({users:allUser})
})
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})