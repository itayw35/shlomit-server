const mongoose = require("mongoose");
const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  time: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
});
const appointmentModel = mongoose.model("appointment", appointmentSchema);
exports.appointmentModel = appointmentModel;
