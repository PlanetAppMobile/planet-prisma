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

const users = require('./routes/user')
const todolist = require('./routes/todolist')
const note = require('./routes/note')
// const project = require('./routes/project')
app.use(users)
app.use(todolist)
app.use(note)
// app.use(project)s
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})