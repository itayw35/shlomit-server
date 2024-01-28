const appointmentLogic = require("../BL/appointmentLogic1.js");
const express = require("express");
const router = express.Router();
const authJWT = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/set-appointment", async (req, res) => {
  try {
    const newAppointment = await appointmentLogic.setAppointment(req.body);
    res.status(newAppointment.code).send(newAppointment.message);
  } catch (err) {
    res.status(err.code || 400).send(err.message || "something went wrong");
  }
});
router.get("/get-appointments", async (req, res) => {
  try {
    const appointments = await appointmentLogic.getAllAppointments();
    res.status(appointments.code).send(appointments.message);
  } catch (err) {
    res.status(err.code || 400).send(err.message || "something went wrong");
  }
});
router.get(
  "/get-appointments-with-info",
  authJWT,
  adminAuth,
  async (req, res) => {
    try {
      const appointments = await appointmentLogic.getAllAppointmentsWithInfo();
      res.status(appointments.code).send(appointments.message);
    } catch (err) {
      res.status(err.code || 400).send(err.message || "something went wrong");
    }
  }
);
router.put("/update-appointment", authJWT, adminAuth, async (req, res) => {
  try {
    const appointment = await appointmentLogic.updateAppointment(req.body);
    res.status(appointment.code).send(appointment.message);
  } catch (err) {
    res.status(err.code || 400).send(err.message || "something went wrong");
  }
});
module.exports = router;
