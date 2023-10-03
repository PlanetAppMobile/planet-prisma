const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/project", async function (req, res, next) {
    const userId = req.body.userId
    try {
        const [data] = await pool.query("SELECT * FROM Projects WHERE assigned_to = ?", [userId]);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
router.post("/project", async function (req, res, next) {
    const { name, description, deadline, start_date, end_date, status, assigned_to } = req.body
    try {
        const [data] = await pool.query("INSERT INTO `Projects`(`project_name`, `project_description`, `project_deadline`, `project_start_date`, `project_end_date`, `project_status`, `assigned_to`) VALUES (?, ?, ?, ?, ?, ?, ?)"
            , [name, description, deadline, start_date, end_date, status, assigned_to]);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
});
module.exports = router;