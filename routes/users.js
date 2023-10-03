const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/users", async function (req, res, next) {
    try {
        const [allUser] = await pool.query("SELECT * FROM Users");
        res.json(allUser);
    } catch (error) {
        res.json(error);
    }
});
module.exports = router;