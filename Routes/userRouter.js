const express = require("express");
const router = express.Router();
const userLogic = require("../BL/userLogic");
const authJWT = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/register", async (req, res) => {
  try {
    const token = await userLogic.makeUser(req.body);
    res.status(200).send(token);
  } catch (e) {
    if (e.code && e.code < 11000) {
      res.status(e.code).send(e.message);
    } else {
      res.send("something went wrong");
    }
  }
});
router.post("/login", async (req, res) => {
  try {
    const token = await userLogic.login(req.body);
    res.status(200).send(token);
  } catch (err) {
    res.status(err.code).send(err.message);
  }
});
router.get("/getuser/:userID?", authJWT, adminAuth, async (req, res) => {
  try {
    const result = await userLogic.findUser(req.params.userID);
    res.status(200).send(result);
  } catch (e) {
    if (e.code && e.code < 11000) {
      res.status(e.code).send(e.message);
    } else {
      res.send("something went wrong");
    }
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    const result = userLogic.putUser(req.params.id, req.body);
    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    if (e.code && e.code < 11000) {
      res.status(e.code).send(e.message);
    } else {
      res.status(400).send("something went wrong");
    }
  }
});

module.exports = router;
