const appointmentController = require("../DL/controllers/appointmentController");
const axios = require("axios");
async function getAllAppointments() {
  const today = new Date();
  const appointments = await appointmentController.read(
    {
      time: { $gt: today },
    },
    "time"
  );
  if (appointments.length === 0)
    throw { code: 400, message: "there are no appointments set" };
  return { code: 200, message: appointments };
}
async function getAllAppointmentsWithInfo() {
  const today = new Date();
  const appointments = await appointmentController.read({
    time: { $gt: today },
  });
  if (appointments.length === 0)
    throw { code: 400, message: "there are no appointments set" };
  return { code: 200, message: appointments };
}
async function setAppointment(data) {
  const { name, phone, date } = data;
  if (!name || !phone || !date) throw { code: 400, message: "missing details" };
  const isOccupied = await appointmentController.readOne({ time: date });
  if (isOccupied) throw { code: 400, message: "מצטערים, התור תפוס" };
  const formattedDate = new Date(date);
  const timestamp = new Date(
    Date.UTC(
      formattedDate.getFullYear(),
      formattedDate.getMonth(),
      formattedDate.getDate(),
      formattedDate.getHours(),
      formattedDate.getMinutes(),
      formattedDate.getSeconds(),
      formattedDate.getMilliseconds()
    )
  );
  appointmentController.create({
    patientName: name,
    phoneNumber: phone,
    time: timestamp,
  });
  sendSMS("+972545395029", `${name} מעוניינת לקבוע תור לתאריך${date}`);
  return {
    code: 200,
    message: `התור שקבעת לתאריך ${date.slice(0, 10)} בשעה ${
      formattedDate.getHours() + 2
    }:${formattedDate.getMinutes()}0 ממתין לאישור. נודיע לך כשהוא יאושר. יום טוב :-)
  `,
  };
}
async function approveAppointment(id) {
  const appointment = await appointmentController.readOne({ _id: id });
  if (!appointment) throw { code: 400, message: "appointment is not found" };
  await appointmentController.update(
    { _id: id },
    { $set: { status: "approved" } }
  );
  return { code: 200, message: "appointment approved" };
}
async function sendSMS(phoneNumber, message) {
  const url = "https://textbelt.com/text";
  const params = new URLSearchParams();
  params.append("phone", phoneNumber);
  params.append("message", message);
  params.append("key", "textbelt");
  try {
    const response = await axios.post(url, params);
    console.log(response.data);
  } catch (err) {
    console.error("Error sending sms: ", err);
  }
}
module.exports = {
  getAllAppointments,
  setAppointment,
  getAllAppointmentsWithInfo,
  approveAppointment,
};
